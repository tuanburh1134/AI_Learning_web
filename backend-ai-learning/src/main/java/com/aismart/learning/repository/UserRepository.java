package com.aismart.learning.repository;

import com.aismart.learning.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
<<<<<<< HEAD
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
=======

public interface UserRepository extends JpaRepository<User, Long> {
>>>>>>> origin/develop
}
