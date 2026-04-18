package com.example.api_gateway;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class ApiGatewayApplicationTests {

	@Test
	void applicationClassExists() {
		assertNotNull(ApiGatewayApplication.class);
	}

	@Test
	void applicationClassHasCorrectAnnotation() {
		assertTrue(ApiGatewayApplication.class.isAnnotationPresent(org.springframework.boot.autoconfigure.SpringBootApplication.class));
	}

	@Test
	void mainMethodExists() throws NoSuchMethodException {
		assertNotNull(ApiGatewayApplication.class.getMethod("main", String[].class));
	}
}
