package com.example.profilemanagement_service.service;

import com.example.profilemanagement_service.dto.UserDTO;
import com.example.profilemanagement_service.model.Role;
import com.example.profilemanagement_service.model.User;
import com.example.profilemanagement_service.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void testLoadUserByUsername_Success() {
        User user = new User();
        user.setUsername("testuser");
        user.setPassword("password");
        user.setRole(Role.USER);

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));

        UserDetails userDetails = userService.loadUserByUsername("testuser");

        assertNotNull(userDetails);
        assertEquals("testuser", userDetails.getUsername());
        assertEquals("password", userDetails.getPassword());
    }

    @Test
    void testLoadUserByUsername_UserNotFound() {
        when(userRepository.findByUsername("nonexistent")).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () -> {
            userService.loadUserByUsername("nonexistent");
        });
    }

    @Test
    void testGetAllUsers() {
        User user1 = new User();
        user1.setUsername("user1");
        User user2 = new User();
        user2.setUsername("user2");

        when(userRepository.findAll()).thenReturn(Arrays.asList(user1, user2));

        List<User> users = userService.getAllUsers();

        assertEquals(2, users.size());
        verify(userRepository).findAll();
    }

    @Test
    void testGetUsersByRole() {
        User adminUser = new User();
        adminUser.setRole(Role.ADMIN);

        when(userRepository.findByRole(Role.ADMIN)).thenReturn(Arrays.asList(adminUser));

        List<User> adminUsers = userService.getUsersByRole(Role.ADMIN);

        assertEquals(1, adminUsers.size());
        assertEquals(Role.ADMIN, adminUsers.get(0).getRole());
    }

    @Test
    void testGetUserByUserId() {
        User user = new User();
        user.setId(1L);
        user.setUsername("testuser");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        UserDTO userDTO = userService.getUserByUserId(1L);

        assertNotNull(userDTO);
        assertEquals(1L, userDTO.getId());
        assertEquals("testuser", userDTO.getUsername());
    }

    @Test
    void testGetUserByUserId_NotFound() {
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        UserDTO userDTO = userService.getUserByUserId(999L);

        assertNull(userDTO);
    }

    @Test
    void testLoadUserByUsername_EmptyUsername() {
        when(userRepository.findByUsername("")).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () -> {
            userService.loadUserByUsername("");
        });
    }

    @Test
    void testLoadUserByUsername_NullUsername() {
        when(userRepository.findByUsername(null)).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () -> {
            userService.loadUserByUsername(null);
        });
    }

    @Test
    void testGetAllUsers_EmptyList() {
        when(userRepository.findAll()).thenReturn(Arrays.asList());

        List<User> users = userService.getAllUsers();

        assertTrue(users.isEmpty());
        verify(userRepository).findAll();
    }

    @Test
    void testGetUsersByRole_EmptyList() {
        when(userRepository.findByRole(Role.USER)).thenReturn(Arrays.asList());

        List<User> users = userService.getUsersByRole(Role.USER);

        assertTrue(users.isEmpty());
        verify(userRepository).findByRole(Role.USER);
    }

    @Test
    void testGetUsersByRole_MultipleUsers() {
        User user1 = new User();
        user1.setRole(Role.USER);
        User user2 = new User();
        user2.setRole(Role.USER);

        when(userRepository.findByRole(Role.USER)).thenReturn(Arrays.asList(user1, user2));

        List<User> users = userService.getUsersByRole(Role.USER);

        assertEquals(2, users.size());
        assertEquals(Role.USER, users.get(0).getRole());
        assertEquals(Role.USER, users.get(1).getRole());
    }

    @Test
    void testLoadUserByUsername_AdminUser() {
        User adminUser = new User();
        adminUser.setUsername("admin");
        adminUser.setPassword("adminpass");
        adminUser.setRole(Role.ADMIN);

        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(adminUser));

        UserDetails userDetails = userService.loadUserByUsername("admin");

        assertNotNull(userDetails);
        assertEquals("admin", userDetails.getUsername());
        assertEquals("adminpass", userDetails.getPassword());
        assertTrue(userDetails.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN")));
    }

    @Test
    void testRegisterUser() {
        User newUser = new User();
        newUser.setUsername("newuser");
        newUser.setEmail("new@example.com");
        newUser.setRole(Role.USER);

        when(userRepository.findByUsername("newuser")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(newUser);

        User result = userService.registerUser(newUser);

        assertNotNull(result);
        assertEquals("newuser", result.getUsername());
        verify(userRepository).save(newUser);
    }

    @Test
    void testRegisterUser_UsernameExists() {
        User existingUser = new User();
        existingUser.setUsername("existinguser");

        User newUser = new User();
        newUser.setUsername("existinguser");

        when(userRepository.findByUsername("existinguser")).thenReturn(Optional.of(existingUser));

        assertThrows(RuntimeException.class, () -> {
            userService.registerUser(newUser);
        });
    }
}