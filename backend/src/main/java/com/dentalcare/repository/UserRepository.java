package com.dentalcare.repository;

import com.dentalcare.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByRoleIn(List<String> roles);
    
    @Query("SELECT u FROM User u WHERE " +
           "(:search = '' OR " +
           "LOWER(u.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.role) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<User> findUsersWithSearch(@Param("search") String search, Pageable pageable);
}