package com.aismart.learning.entity;

<<<<<<< HEAD
import jakarta.persistence.*;
import lombok.*;

/**
 * Entity đại diện cho một câu hỏi trong bài kiểm tra.
 */
@Entity
@Table(name = "questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String answer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;
=======
public class Question {
    private String content;
    private String answer;
>>>>>>> origin/develop
}
