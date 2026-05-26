package com.aismart.learning.entity;

import com.aismart.learning.constant.RoleType;
import jakarta.persistence.*;
import lombok.*;

/**
 * Entity đại diện cho người dùng trong hệ thống.
 */
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "full_name", length = 100)
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private RoleType role = RoleType.STUDENT;

    @Column(length = 30)
    private String grade;

    @Column(length = 255)
    private String subjects;

    @Column(name = "current_level", length = 30)
    private String currentLevel;

    @Column(length = 100)
    private String goal;

    @Column(name = "onboarded")
    @Builder.Default
    private Boolean onboarded = false;
}
