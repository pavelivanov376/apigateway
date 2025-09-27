package com.apigateway.apigateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class ApiGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                // Route /download/{id} to in File Service
                .route("download-file-request", r -> r
                        .path("/api/download/{id}")
                        .filters(f -> f.rewritePath("/api/download/(?<id>.*)", "/api/download/${id}"))
                        .uri("http://fileservice:80")
                )

                // Route /api/upload to File Service
                .route("upload-file-request", r -> r
                        .path("/api/upload")
                        .uri("http://fileservice:80")
                )

                //ROUTS FOR FOLDER SERVICE

                // Route /api/folder to Folder Service
                .route("create-folder-request", r -> r
                        .path("/api/folder/create")
                        .uri("http://folderservice:80")
                )

                // Route /folder/{id} to Folder Service
                .route("list-folder-request", r -> r
                        .path("/api/folder/{id}")
                        .filters(f -> f.rewritePath("/api/folder/(?<id>.*)", "/api/folder/${id}"))
                        .uri("http://folderservice:80")
                )

                // Route /folder/{id} to Folder Service
                .route("create-folder-name-only-request", r -> r
                        .path("/api/folder/create/{id}")
                        .filters(f -> f.rewritePath("/api/folder/(?<id>.*)", "/api/folder/${id}"))
                        .uri("http://folderservice:80")
                )

                // Route /api/file/link/folder to Folder Service
                .route("link-file-to-parent-folder", r -> r
                        .path("/api/file/link/folder")
                        .uri("http://folderservice:80")
                )

                .build();
        //TODO: Can add Circuit Breaker, Rate Limiting, and other filters https://spring.io/guides/gs/gateway
    }
}
