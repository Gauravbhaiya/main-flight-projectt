package com.example.booking_service.kafka;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class BookingProducer {

    private static final String TOPIC = "booking-confirmed";

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    public void sendBookingConfirmed(String message) {
        kafkaTemplate.send(TOPIC, message);
        System.out.println("Kafka Event Sent -> Topic: " + TOPIC + " | Message: " + message);
    }
}
