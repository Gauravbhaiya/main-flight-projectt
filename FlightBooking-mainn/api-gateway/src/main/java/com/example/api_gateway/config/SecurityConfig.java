package com.example.api_gateway.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Value("${PROFILE_SERVICE_URL}")
    private String profileServiceUrl;

    @Value("${FLIGHT_SERVICE_URL}")
    private String flightServiceUrl;

    @Value("${BOOKING_SERVICE_URL}")
    private String bookingServiceUrl;

    @Value("${FARE_SERVICE_URL}")
    private String fareServiceUrl;

    @Bean
    public RouteLocator routeLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("auth", r -> r.path("/auth/**")
                        .uri(profileServiceUrl))

                .route("flight", r -> r.path("/flight/**")
                        .filters(f -> f.filter(jwtFilter))
                        .uri(flightServiceUrl))

                .route("booking", r -> r.path("/booking/**")
                        .filters(f -> f.filter(jwtFilter))
                        .uri(bookingServiceUrl))

                .route("profile", r -> r.path("/profile/**")
                        .filters(f -> f.filter(jwtFilter))
                        .uri(profileServiceUrl))
                .build();

    }

}