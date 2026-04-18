package com.example.profilemanagement_service.controller;

import com.example.profilemanagement_service.dto.LoginDTO;
import com.example.profilemanagement_service.dto.RegisterDTO;
import com.example.profilemanagement_service.model.Role;
import com.example.profilemanagement_service.model.User;
import com.example.profilemanagement_service.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureWebMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testRegisterUser_Success() throws Exception {
        RegisterDTO registerDTO = new RegisterDTO();
        registerDTO.username = "testuser";
        registerDTO.name = "Test User";
        registerDTO.email = "test@example.com";
        registerDTO.password = "password123";
        registerDTO.role = Role.USER;

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(new User());

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerDTO)))
                .andExpect(status().isOk())
                .andExpect(content().string("User registered successfully"));
    }

    @Test
    void testRegisterUser_UsernameExists() throws Exception {
        RegisterDTO registerDTO = new RegisterDTO();
        registerDTO.username = "existinguser";

        User existingUser = new User();
        existingUser.setUsername("existinguser");
        when(userRepository.findByUsername("existinguser")).thenReturn(Optional.of(existingUser));

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Username already registered"));
    }

    @Test
    void testRegisterUser_EmptyUsername() throws Exception {
        RegisterDTO registerDTO = new RegisterDTO();
        registerDTO.username = "";
        registerDTO.name = "Test User";
        registerDTO.email = "test@example.com";
        registerDTO.password = "password123";
        registerDTO.role = Role.USER;

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerDTO)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testRegisterUser_NullUsername() throws Exception {
        RegisterDTO registerDTO = new RegisterDTO();
        registerDTO.username = null;
        registerDTO.name = "Test User";
        registerDTO.email = "test@example.com";
        registerDTO.password = "password123";
        registerDTO.role = Role.USER;

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerDTO)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testRegisterUser_InvalidEmail() throws Exception {
        RegisterDTO registerDTO = new RegisterDTO();
        registerDTO.username = "testuser";
        registerDTO.name = "Test User";
        registerDTO.email = "invalid-email";
        registerDTO.password = "password123";
        registerDTO.role = Role.USER;

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.empty());

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerDTO)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testRegisterUser_WeakPassword() throws Exception {
        RegisterDTO registerDTO = new RegisterDTO();
        registerDTO.username = "testuser";
        registerDTO.name = "Test User";
        registerDTO.email = "test@example.com";
        registerDTO.password = "123";
        registerDTO.role = Role.USER;

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.empty());

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerDTO)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testLoginUser_Success() throws Exception {
        LoginDTO loginDTO = new LoginDTO();
        loginDTO.username = "testuser";
        loginDTO.password = "password123";

        User user = new User();
        user.setUsername("testuser");
        user.setPassword("encodedPassword");
        user.setRole(Role.USER);

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));

        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isOk());
    }

    @Test
    void testLoginUser_InvalidCredentials() throws Exception {
        LoginDTO loginDTO = new LoginDTO();
        loginDTO.username = "testuser";
        loginDTO.password = "wrongpassword";

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.empty());

        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testLoginUser_EmptyCredentials() throws Exception {
        LoginDTO loginDTO = new LoginDTO();
        loginDTO.username = "";
        loginDTO.password = "";

        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testRegisterUser_AdminRole() throws Exception {
        RegisterDTO registerDTO = new RegisterDTO();
        registerDTO.username = "adminuser";
        registerDTO.name = "Admin User";
        registerDTO.email = "admin@example.com";
        registerDTO.password = "adminpass123";
        registerDTO.role = Role.ADMIN;

        when(userRepository.findByUsername("adminuser")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(new User());

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerDTO)))
                .andExpect(status().isOk())
                .andExpect(content().string("User registered successfully"));
    }

    @Test
    void testRegisterUser_MalformedJson() throws Exception {
        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("invalid json"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testLoginUser_MalformedJson() throws Exception {
        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("invalid json"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testRegisterUser_DatabaseError() throws Exception {
        RegisterDTO registerDTO = new RegisterDTO();
        registerDTO.username = "testuser";
        registerDTO.name = "Test User";
        registerDTO.email = "test@example.com";
        registerDTO.password = "password123";
        registerDTO.role = Role.USER;

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class)))
                .thenThrow(new RuntimeException("Database error"));

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerDTO)))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void testRegisterUser_NullPassword() throws Exception {
        RegisterDTO registerDTO = new RegisterDTO();
        registerDTO.username = "testuser";
        registerDTO.name = "Test User";
        registerDTO.email = "test@example.com";
        registerDTO.password = null;
        registerDTO.role = Role.USER;

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerDTO)))
                .andExpect(status().isBadRequest());
    }
}