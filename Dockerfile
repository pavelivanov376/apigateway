# Stage 1: Build React app
FROM node:20 as frontend-build

WORKDIR /app
COPY ui/package*.json ./ui/
RUN cd ui && npm install

COPY ui/ ./ui/
RUN cd ui && npm run build

# Stage 2: Build Spring Boot app with copied frontend
FROM eclipse-temurin:21-jdk as backend-build

WORKDIR /app

# Copy backend source and build tools
COPY . .

# Clean previous static files
RUN rm -rf src/main/resources/static/*

# Copy built React app into Spring Boot static folder
COPY --from=frontend-build /app/ui/build/ src/main/resources/static/

# Make Maven wrapper executable
RUN chmod +x mvnw

# Build the Spring Boot app
RUN ./mvnw clean package -DskipTests -Dmaven.compiler.debug=true -Dmaven.compiler.debuglevel=lines,vars,source

# Stage 3: Create minimal runtime image
FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app
COPY --from=backend-build /app/target/*.jar app.jar

# Expose application port and debug port
EXPOSE 80 5005

# Enable remote debugging
ENTRYPOINT ["java", "-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005", "-jar", "app.jar"]
