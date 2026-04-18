package com.example.api_gateway.config;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.net.URI;
import java.util.Date;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.lenient;

@ExtendWith(MockitoExtension.class)
class JwtFilterTest {

    @Mock(lenient = true)
    private ServerWebExchange exchange;
    
    @Mock(lenient = true)
    private GatewayFilterChain chain;
    
    @Mock(lenient = true)
    private ServerHttpRequest request;
    
    @Mock(lenient = true)
    private ServerHttpResponse response;
    
    @Mock(lenient = true)
    private HttpHeaders headers;

    @InjectMocks
    private JwtFilter jwtFilter;

    private final String secretKey = "supersecretkeythatisverylong123456";

    @BeforeEach
    void setUp() {
        lenient().when(exchange.getRequest()).thenReturn(request);
        lenient().when(exchange.getResponse()).thenReturn(response);
        lenient().when(request.getHeaders()).thenReturn(headers);
        lenient().when(chain.filter(exchange)).thenReturn(Mono.empty());
        lenient().when(response.setComplete()).thenReturn(Mono.empty());
    }



    @Test
    void testFilter_AuthPath_ShouldBypass() {
        when(request.getURI()).thenReturn(URI.create("/auth/login"));

        jwtFilter.filter(exchange, chain);

        verify(chain).filter(exchange);
        verify(response, never()).setStatusCode(any());
    }

    @Test
    void testFilter_NoAuthHeader_ShouldReturnUnauthorized() {
        when(request.getURI()).thenReturn(URI.create("/booking/create"));
        when(headers.get("Authorization")).thenReturn(null);

        jwtFilter.filter(exchange, chain);

        verify(response).setStatusCode(HttpStatus.UNAUTHORIZED);
        verify(response).setComplete();
    }

    @Test
    void testFilter_EmptyAuthHeader_ShouldReturnUnauthorized() {
        when(request.getURI()).thenReturn(URI.create("/booking/create"));
        when(headers.get("Authorization")).thenReturn(List.of());

        jwtFilter.filter(exchange, chain);

        verify(response).setStatusCode(HttpStatus.UNAUTHORIZED);
        verify(response).setComplete();
    }

    @Test
    void testFilter_InvalidTokenFormat_ShouldReturnUnauthorized() {
        when(request.getURI()).thenReturn(URI.create("/booking/create"));
        when(headers.get("Authorization")).thenReturn(List.of("InvalidToken"));

        jwtFilter.filter(exchange, chain);

        verify(response).setStatusCode(HttpStatus.UNAUTHORIZED);
        verify(response).setComplete();
    }

    @Test
    void testFilter_ValidToken_ShouldProceed() {
        String token = createValidToken("USER", "testuser");
        when(request.getURI()).thenReturn(URI.create("/booking/create"));
        when(headers.get("Authorization")).thenReturn(List.of("Bearer " + token));
        
        ServerHttpRequest.Builder requestBuilder = mock(ServerHttpRequest.Builder.class);
        when(request.mutate()).thenReturn(requestBuilder);
        when(requestBuilder.header(anyString(), anyString())).thenReturn(requestBuilder);
        when(requestBuilder.build()).thenReturn(request);

        jwtFilter.filter(exchange, chain);

        verify(chain).filter(exchange);
    }

    @Test
    void testFilter_ExpiredToken_ShouldReturnUnauthorized() {
        String token = createExpiredToken("USER", "testuser");
        when(request.getURI()).thenReturn(URI.create("/booking/create"));
        when(headers.get("Authorization")).thenReturn(List.of("Bearer " + token));

        jwtFilter.filter(exchange, chain);

        verify(response).setStatusCode(HttpStatus.UNAUTHORIZED);
        verify(response).setComplete();
    }

    @Test
    void testFilter_InsufficientRole_ShouldReturnForbidden() {
        String token = createValidToken("USER", "testuser");
        when(request.getURI()).thenReturn(URI.create("/flight/create"));
        when(headers.get("Authorization")).thenReturn(List.of("Bearer " + token));

        jwtFilter.filter(exchange, chain);

        verify(response).setStatusCode(HttpStatus.FORBIDDEN);
        verify(response).setComplete();
    }

    private String createValidToken(String role, String username) {
        return Jwts.builder()
                .setSubject(username)
                .claim("roles", role)
                .setExpiration(new Date(System.currentTimeMillis() + 86400000))
                .signWith(Keys.hmacShaKeyFor(secretKey.getBytes()))
                .compact();
    }

    private String createExpiredToken(String role, String username) {
        return Jwts.builder()
                .setSubject(username)
                .claim("roles", role)
                .setExpiration(new Date(System.currentTimeMillis() - 86400000))
                .signWith(Keys.hmacShaKeyFor(secretKey.getBytes()))
                .compact();
    }
}