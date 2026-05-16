package com.aismart.learning.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Quiz {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    @ElementCollection
    private List<String> questions;
}
