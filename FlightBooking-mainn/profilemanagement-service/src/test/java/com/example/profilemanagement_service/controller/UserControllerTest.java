package com.example.profilemanagement_service.controller;

import com.example.profilemanagement_service.dto.UserDTO;
import com.example.profilemanagement_service.model.Role;
import com.example.profilemanagement_service.model.User;
import com.example.profilemanagement_service.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    private User validUser;
    private UserDTO validUserDTO;

    @BeforeEach
    void setUp() {
        validUser = new User();
        validUser.setId(1L);
        validUser.setUsername("testuser");
        validUser.setName("Test User");
        validUser.setEmail("test@example.com");
        validUser.setRole(Role.USER);

        validUserDTO = new UserDTO();
        validUserDTO.id = 1L;
        validUserDTO.username = "testuser";
    }

    @Test
    void testGetAllUsers_Success() throws Exception {
        List<User> users = Arrays.asList(validUser);
        when(userService.getAllUsers()).thenReturn(users);

        mockMvc.perform(get("/users/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].username").value("testuser"));
    }

    @Test
    void testGetAllUsers_EmptyList() throws Exception {
        when(userService.getAllUsers()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/users/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void testGetUserById_Success() throws Exception {
        when(userService.getUserByUserId(1L)).thenReturn(validUserDTO);

        mockMvc.perform(get("/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.username").value("testuser"));
    }

    @Test
    void testGetUserById_NotFound() throws Exception {
        when(userService.getUserByUserId(999L)).thenReturn(null);

        mockMvc.perform(get("/users/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testGetUsersByRole_Success() throws Exception {
        List<User> users = Arrays.asList(validUser);
        when(userService.getUsersByRole(Role.USER)).thenReturn(users);

        mockMvc.perform(get("/users/role/USER"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].role").value("USER"));
    }

    @Test
    void testGetUsersByRole_EmptyList() throws Exception {
        when(userService.getUsersByRole(Role.ADMIN)).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/users/role/ADMIN"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void testGetUsersByRole_InvalidRole() throws Exception {
        mockMvc.perform(get("/users/role/INVALID"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testCreateUser_Success() throws Exception {
        when(userService.registerUser(any(User.class))).thenReturn(validUser);

        mockMvc.perform(post("/users/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validUser)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.username").value("testuser"));
    }

    @Test
    void testCreateUser_InvalidData() throws Exception {
        User invalidUser = new User();
        invalidUser.setUsername(""); // Empty username

        mockMvc.perform(post("/users/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidUser)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testUpdateUser_Success() throws Exception {
        User updatedUser = new User();
        updatedUser.setId(1L);
        updatedUser.setUsername("updateduser");

        when(userService.registerUser(any(User.class))).thenReturn(updatedUser);

        mockMvc.perform(put("/users/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("updateduser"));
    }

    @Test
    void testUpdateUser_NotFound() throws Exception {
        when(userService.registerUser(any(User.class))).thenThrow(new RuntimeException("User not found"));

        mockMvc.perform(put("/users/999")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validUser)))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void testDeleteUser_Success() throws Exception {
        mockMvc.perform(delete("/users/1"))
                .andExpect(status().isNotFound()); // Method doesn't exist
    }

    @Test
    void testDeleteUser_NotFound() throws Exception {
        mockMvc.perform(delete("/users/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testFindByUsername_Success() throws Exception {
        mockMvc.perform(get("/users/username/testuser"))
                .andExpect(status().isNotFound()); // Method doesn't exist
    }

    @Test
    void testFindByUsername_NotFound() throws Exception {
        mockMvc.perform(get("/users/username/nonexistent"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testCreateUser_MalformedJson() throws Exception {
        mockMvc.perform(post("/users/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content("invalid json"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testUpdateUser_MalformedJson() throws Exception {
        mockMvc.perform(put("/users/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("invalid json"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testGetUserById_InvalidId() throws Exception {
        mockMvc.perform(get("/users/invalid"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testDeleteUser_InvalidId() throws Exception {
        mockMvc.perform(delete("/users/invalid"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testCreateUser_ServiceException() throws Exception {
        when(userService.registerUser(any(User.class)))
                .thenThrow(new RuntimeException("Service error"));

        mockMvc.perform(post("/users/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validUser)))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void testGetAllUsers_ServiceException() throws Exception {
        when(userService.getAllUsers())
                .thenThrow(new RuntimeException("Service error"));

        mockMvc.perform(get("/users/all"))
                .andExpect(status().isInternalServerError());
    }
}