package com.apigateway.apigateway.services;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.concurrent.CompletableFuture;

@Service
public class RenderWarmupService {

    @Value("${app.fileservice.url}")
    private String fileServiceUrl;

    @Value("${app.folderservice.url}")
    private String folderServiceUrl;

    private final RestClient restClient;

    public RenderWarmupService(RestClient.Builder builder) {
        this.restClient = builder.build();
    }

    @PostConstruct
    public void warmupServices() {
        CompletableFuture.runAsync(() -> {

            // Retry 10 times over 5 minutes
            for (int i = 0; i < 10; i++) {

                fireAndForget(fileServiceUrl);
                fireAndForget(folderServiceUrl);

                try {
                    Thread.sleep(30_000);
                } catch (InterruptedException ignored) {
                    Thread.currentThread().interrupt();
                    return;
                }
            }
        });
    }

    private void fireAndForget(String baseUrl) {
        try {
            restClient.get()
                    .uri(baseUrl + "/actuator/health")
                    .retrieve()
                    .toBodilessEntity();
        } catch (Exception ignored) {
            // Intentionally ignored
        }
    }
}