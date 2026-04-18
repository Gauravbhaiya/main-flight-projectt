package com.example.booking_service.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Passenger {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long passengerId;

    @NotBlank(message = "First name must not be blank")
    private String firstName;

    @NotBlank(message = "Last name must not be blank")
    private String lastName;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email must not be blank")
    private String email;

    @NotBlank(message = "Gender must not be blank")
    private String gender;

    // FIXED: Changed from Long to String
    @NotBlank(message = "Aadhar number must not be blank")
    @Pattern(regexp = "\\d{12}", message = "Aadhar number must be exactly 12 digits")
    private String aadharNumber;

    @NotNull(message = "Flight ID must not be null")
    private Long flightId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    @JsonIgnore
    private Booking booking;
}