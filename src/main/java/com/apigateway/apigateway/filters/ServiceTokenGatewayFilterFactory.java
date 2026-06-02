package com.apigateway.apigateway.filters;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.security.Principal;

/**
 * Gateway filter that adds service-to-service authentication headers.
 *
 * This filter:
 * 1. Adds X-Service-Token header - allows backend services to verify the request came from the gateway
 * 2. Adds X-Authenticated-User header - passes the authenticated username to backend services
 *
 * Backend services should validate X-Service-Token before processing requests.
 */
@Component
public class ServiceTokenGatewayFilterFactory extends AbstractGatewayFilterFactory<ServiceTokenGatewayFilterFactory.Config> {

    public static final String SERVICE_TOKEN_HEADER = "X-Service-Token";
    public static final String AUTHENTICATED_USER_HEADER = "X-Authenticated-User";

    @Value("${app.service.token}")
    private String serviceToken;

    public ServiceTokenGatewayFilterFactory() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            // Get the authenticated principal (username)
            return exchange.getPrincipal()
                    .defaultIfEmpty(() -> "anonymous")
                    .flatMap(principal -> {
                        String username = principal.getName();

                        // Mutate the request to add service headers
                        ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                                .header(SERVICE_TOKEN_HEADER, serviceToken)
                                .header(AUTHENTICATED_USER_HEADER, username)
                                .build();

                        // Continue with the modified request
                        return chain.filter(exchange.mutate().request(mutatedRequest).build());
                    });
        };
    }

    /**
     * Configuration class for the filter (empty for now, can be extended for customization)
     */
    public static class Config {
        // Can add configuration properties here if needed
        // e.g., whether to include user header, custom header names, etc.
    }
}
