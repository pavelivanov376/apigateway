package com.apigateway.apigateway;

import com.apigateway.apigateway.filters.ServiceTokenGatewayFilterFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class ApiGatewayApplication {

    @Value("${app.fileservice.url}")
    private String fileserviceUrl;

    @Value("${app.folderservice.url}")
    private String folderserviceUrl;

    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder,
                                           ServiceTokenGatewayFilterFactory serviceTokenFilter) {
        return builder.routes()
                // Route /download/{id} to in File Service
                .route("download-file-request", r -> r
                        .path("/api/download/{id}")
                        .filters(f -> f.rewritePath("/api/download/(?<id>.*)", "/api/download/${id}")
                                .filter(serviceTokenFilter.apply(new ServiceTokenGatewayFilterFactory.Config())))
                        .uri(fileserviceUrl)
                )

                // Route /api/upload to File Service
                .route("upload-file-request", r -> r
                        .path("/api/upload")
                        .filters(f -> f.filter(serviceTokenFilter.apply(new ServiceTokenGatewayFilterFactory.Config())))
                        .uri(fileserviceUrl)
                )

                // Route /api/file/{uuid} DELETE to File Service
                .route("delete-file-request", r -> r
                        .path("/api/file/{uuid}")
                        .filters(f -> f.filter(serviceTokenFilter.apply(new ServiceTokenGatewayFilterFactory.Config())))
                        .uri(fileserviceUrl)
                )

                //ROUTES FOR FOLDER SERVICE

                // Route /api/folder/create to Folder Service
                .route("create-folder-request", r -> r
                        .path("/api/folder/create")
                        .filters(f -> f
                                .filter(serviceTokenFilter.apply(new ServiceTokenGatewayFilterFactory.Config())))
                        .uri(folderserviceUrl)
                )

                // Route /folder/{id} to Folder Service
                .route("list-folder-request", r -> r
                        .path("/api/folder/{id}")
                        .filters(f -> f.rewritePath("/api/folder/(?<id>.*)", "/api/folder/${id}")
                                .filter(serviceTokenFilter.apply(new ServiceTokenGatewayFilterFactory.Config())))
                        .uri(folderserviceUrl)
                )

                // Route /folder/create/{id} to Folder Service
                .route("create-folder-name-only-request", r -> r
                        .path("/api/folder/create/{id}")
                        .filters(f -> f.rewritePath("/api/folder/(?<id>.*)", "/api/folder/${id}")
                                .filter(serviceTokenFilter.apply(new ServiceTokenGatewayFilterFactory.Config())))
                        .uri(folderserviceUrl)
                )

                // Route /api/file/link/folder to Folder Service
                .route("link-file-to-parent-folder", r -> r
                        .path("/api/file/link/folder")
                        .filters(f -> f.filter(serviceTokenFilter.apply(new ServiceTokenGatewayFilterFactory.Config())))
                        .uri(folderserviceUrl)
                )

                .build();
        //TODO: Can add Circuit Breaker, Rate Limiting, and other filters https://spring.io/guides/gs/gateway
    }
}
