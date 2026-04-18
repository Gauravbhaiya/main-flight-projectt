package com.example.fare_service.kafka;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class BookingConsumer {

    @KafkaListener(topics = "booking-confirmed", groupId = "fare-service-group")
    public void consumeBookingConfirmed(String message) {
        System.out.println("Kafka Event Received -> Topic: booking-confirmed | Message: " + message);
        // TODO: trigger payment processing logic here
    }
}
