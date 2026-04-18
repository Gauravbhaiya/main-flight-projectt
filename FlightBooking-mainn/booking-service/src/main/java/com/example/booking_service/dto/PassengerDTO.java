package com.example.booking_service.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
public class PassengerDTO {
    @NotBlank(message = "First name is required")
    public String firstName;

    @NotBlank(message = "Last name is required")
    public String lastName;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    public String email;

    @NotBlank(message = "Gender must not be blank")
    public String gender;

    public @NotBlank(message = "Aadhar number must not be blank")
    @Pattern(regexp = "\\d{12}", message = "Aadhar number must be exactly 12 digits") String aadharNumber;
}
