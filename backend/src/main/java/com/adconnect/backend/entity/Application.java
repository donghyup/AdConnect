package com.adconnect.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "applications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long campaignId;

    @Column(nullable = false)
    private String partnerEmail;

    @Column(nullable = false)
    private String partnerName;

    @Column(length = 1000)
    private String message;

    @Column(nullable = false)
    private String status; // 대기, 수락, 거절
}
