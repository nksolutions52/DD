package com.dentalcare.service;

import com.dentalcare.model.User;
import com.dentalcare.model.Role;
import com.dentalcare.repository.UserRepository;
import com.dentalcare.repository.RoleRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.Arrays;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    
    public UserService(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public List<User> getDentists() {
        return userRepository.findByRoleIn(Arrays.asList("dentist", "admin", "doctor"));
    }
    
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
    
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public User createUser(User user) {
        // Set role entity based on role string
        if (user.getRole() != null) {
            Optional<Role> roleEntity = roleRepository.findByName(user.getRole());
            roleEntity.ifPresent(user::setRoleEntity);
        }
        return userRepository.save(user);
    }
    
    public Optional<User> updateUser(Long id, User user) {
        if (userRepository.existsById(id)) {
            user.setId(id);
            // Set role entity based on role string
            if (user.getRole() != null) {
                Optional<Role> roleEntity = roleRepository.findByName(user.getRole());
                roleEntity.ifPresent(user::setRoleEntity);
            }
            return Optional.of(userRepository.save(user));
        }
        return Optional.empty();
    }
    
    public boolean deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    public Optional<User> authenticate(String email, String password) {
        return userRepository.findByEmail(email)
                .filter(user -> user.getPassword().equals(password));
    }
}