package com.adconnect.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "campaigns")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Campaign {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String company;

    @Column(nullable = false)
    private String title;

    private String category;
    private String budget;
    private String subscribersRequired;

    @Column(nullable = false)
    private String status; // 승인 대기, 승인 완료, 반려

    private Integer clicks;
    private Integer views;
    private Integer registrations;

    private String duration;

    @Column(length = 2000)
    private String description;

    private String genre;
    private String region;
    private Integer likes;
    private Integer comments;
}
