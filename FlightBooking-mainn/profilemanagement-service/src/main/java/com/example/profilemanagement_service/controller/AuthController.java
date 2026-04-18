package com.example.profilemanagement_service.controller;

import com.example.profilemanagement_service.dto.LoginDTO;
import com.example.profilemanagement_service.dto.RegisterDTO;
import com.example.profilemanagement_service.dto.ResponseDTO;
import com.example.profilemanagement_service.model.User;
import com.example.profilemanagement_service.repository.UserRepository;
import com.example.profilemanagement_service.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtUtil jwtUtil;

    private BCryptPasswordEncoder encoder=new BCryptPasswordEncoder(12);

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterDTO request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already registered");
        }
        User user = new User();
        user.setUsername(request.getUsername());
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(encoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Credentials");
        }
        User user = userRepository.findByUsername(request.getUsername()).get();
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
        System.out.print(user.getUsername());
        return ResponseEntity.ok(new ResponseDTO(token, user.getRole().name()));
    }

    @GetMapping("/getAllUsers")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        // Remove password from response for security
        users.forEach(user -> user.setPassword(null));
        return ResponseEntity.ok(users);
    }
}