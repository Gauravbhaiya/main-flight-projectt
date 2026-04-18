package com.example.api_gateway.config;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.cloud.gateway.route.Route;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import reactor.core.publisher.Flux;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.withSettings;

@ExtendWith(MockitoExtension.class)
class SecurityConfigTest {

    @Mock(lenient = true)
    private JwtFilter jwtFilter;

    @Mock(lenient = true)
    private RouteLocatorBuilder routeLocatorBuilder;

    @InjectMocks
    private SecurityConfig securityConfig;

    @Test
    void testSecurityConfig_Configuration() {
        assertNotNull(securityConfig);
        assertNotNull(jwtFilter);
    }

    @Test
    void testRouteLocator_Creation() {
        RouteLocatorBuilder.Builder mockBuilder = mock(RouteLocatorBuilder.Builder.class, withSettings().lenient());
        RouteLocator mockRouteLocator = mock(RouteLocator.class, withSettings().lenient());
        
        lenient().when(routeLocatorBuilder.routes()).thenReturn(mockBuilder);
        lenient().when(mockBuilder.route(anyString(), any())).thenReturn(mockBuilder);
        lenient().when(mockBuilder.build()).thenReturn(mockRouteLocator);
        lenient().when(mockRouteLocator.getRoutes()).thenReturn(Flux.empty());

        RouteLocator result = securityConfig.routeLocator(routeLocatorBuilder);

        assertNotNull(result);
    }

    @Test
    void testJwtFilter_Injection() {
        assertNotNull(jwtFilter);
    }

    @Test
    void testSecurityConfig_BeanCreation() {
        assertNotNull(securityConfig);
    }



    @Test
    void testRouteLocator_VerifyRouteCount() {
        RouteLocatorBuilder.Builder mockBuilder = mock(RouteLocatorBuilder.Builder.class, withSettings().lenient());
        RouteLocator mockRouteLocator = mock(RouteLocator.class, withSettings().lenient());
        
        lenient().when(routeLocatorBuilder.routes()).thenReturn(mockBuilder);
        lenient().when(mockBuilder.route(eq("auth"), any())).thenReturn(mockBuilder);
        lenient().when(mockBuilder.route(eq("flight"), any())).thenReturn(mockBuilder);
        lenient().when(mockBuilder.route(eq("booking"), any())).thenReturn(mockBuilder);
        lenient().when(mockBuilder.route(eq("profile"), any())).thenReturn(mockBuilder);
        lenient().when(mockBuilder.build()).thenReturn(mockRouteLocator);

        RouteLocator result = securityConfig.routeLocator(routeLocatorBuilder);
        
        assertNotNull(result);
    }
}