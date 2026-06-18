package com.adconnect.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "settlements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Settlement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // One settlement per matched application (creator ↔ campaign)
    @Column(nullable = false, unique = true)
    private Long applicationId;

    private Long campaignId;

    private String projectName;

    private String advertiserName; // 갑

    private String creatorName;    // 을

    private String creatorEmail;

    private String amount;

    // 예치 대기 -> 예치 완료 -> 작업 완료 -> 정산 완료
    @Column(nullable = false)
    private String status;

    private String createdAt;
}
