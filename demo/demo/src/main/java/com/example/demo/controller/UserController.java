package com.example.demo.controller;

import com.example.demo.dto.UserProfileResponse;
import com.example.demo.model.Users;
import com.example.demo.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        String email = authentication.getName();
        Users user = userRepository.findByEmail(email).orElse(null);

        if (user != null) {
            return ResponseEntity.ok(new UserProfileResponse(
                    user.getName(),
                    user.getEmail(),
                    user.getAddress()
            ));
        } else {
            return ResponseEntity.status(404).body("User not found");
        }
    }
}