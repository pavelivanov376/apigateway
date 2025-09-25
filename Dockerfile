# syntax=docker/dockerfile:1.3

############################
# Stage 1: Build React app #
############################
FROM node:20-alpine AS frontend-build

WORKDIR /app/ui

# Copy only package files first for caching dependencies
COPY ui/package*.json ./
RUN --mount=type=cache,target=/app/ui/node_modules \
    npm install

# Now copy UI source code and build
COPY ui/ .
RUN --mount=type=cache,target=/app/ui/node_modules \
    npm run build

###############################
# Stage 2: Build Spring Boot  #
###############################
FROM maven:3.9.9-eclipse-temurin-21 AS backend-build

WORKDIR /app

# Copy only Maven files first to cache dependencies
COPY pom.xml mvnw ./
COPY .mvn .mvn

RUN chmod +x mvnw
RUN --mount=type=cache,target=/root/.m2 \
    ./mvnw dependency:go-offline

# Copy backend source
COPY src ./src

# Clean old static files & add frontend build
RUN rm -rf src/main/resources/static/* && \
    mkdir -p src/main/resources/static

COPY --from=frontend-build /app/ui/build/ src/main/resources/static/

# Build Spring Boot jar
RUN --mount=type=cache,target=/root/.m2 \
    ./mvnw clean package -DskipTests \
    -Dmaven.compiler.debug=true \
    -Dmaven.compiler.debuglevel=lines,vars,source

##############################
# Stage 3: Runtime image     #
##############################
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app
COPY --from=backend-build /app/target/*.jar app.jar

EXPOSE 80 5005
ENTRYPOINT ["java", "-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005", "-jar", "app.jar"]
