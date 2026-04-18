package com.example.api_gateway.config;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import static org.junit.jupiter.api.Assertions.*;    
@ExtendWith(MockitoExtension.class)
class CorsConfigTest {

    @InjectMocks
    private CorsConfig corsConfig;

    @Test
    void testCorsConfigurationSource() {
        CorsConfigurationSource source = corsConfig.corsConfigurationSource();
        
        assertNotNull(source);
        assertTrue(source instanceof UrlBasedCorsConfigurationSource);
    }

    @Test
    void testCorsWebFilter() {
        CorsWebFilter filter = corsConfig.corsWebFilter();
        
        assertNotNull(filter);
    }

    @Test
    void testCorsConfigBean() {
        assertNotNull(corsConfig);
    }

    @Test
    void testCorsConfigurationCreation() {
        assertDoesNotThrow(() -> {
            corsConfig.corsConfigurationSource();
        });
    }

    @Test
    void testCorsWebFilterCreation() {
        assertDoesNotThrow(() -> {
            corsConfig.corsWebFilter();
        });
    }
}
