package com.apigateway.apigateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.userdetails.MapReactiveUserDetailsService;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.server.SecurityWebFilterChain;

/**
 * Security configuration for the API Gateway.
 * Uses reactive security (WebFlux) since Spring Cloud Gateway is reactive.
 *
 * Authentication flow:
 * 1. External users authenticate with Basic Auth (username/password)
 * 2. Gateway validates credentials and creates security context
 * 3. ServiceTokenGatewayFilter adds X-Service-Token header for backend services
 */
@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        return http
                // Disable CSRF for stateless API
                .csrf(ServerHttpSecurity.CsrfSpec::disable)

                // Configure authorization
                .authorizeExchange(exchanges -> exchanges
                        // Allow static resources (React UI)
                        .pathMatchers("/", "/index.html", "/static/**", "/*.js", "/*.css", "/*.ico", "/*.json").permitAll()
                        // Allow actuator health endpoint (for Kubernetes probes)
                        .pathMatchers("/actuator/health").permitAll()
                        // All API endpoints require authentication
                        .pathMatchers("/api/**").authenticated()
                        // Deny everything else by default
                        .anyExchange().authenticated()
                )

                // Enable HTTP Basic authentication
                .httpBasic(Customizer.withDefaults())

                .build();
    }

    @Bean
    public MapReactiveUserDetailsService userDetailsService(PasswordEncoder passwordEncoder) {
        UserDetails admin = User.builder()
                .username("admin")
                .password(passwordEncoder.encode("admin123"))
                .roles("ADMIN", "USER")
                .build();

        return new MapReactiveUserDetailsService(admin);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
