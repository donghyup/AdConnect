package com.adconnect.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;     // 유저 신고, 스팸 의심 등

    private String target;   // 신고 대상

    private String reporter; // 신고 접수자

    @Column(nullable = false)
    private String status;   // 대기 중, 처리 완료

    private String date;
}
