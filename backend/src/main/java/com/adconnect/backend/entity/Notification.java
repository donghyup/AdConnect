package com.adconnect.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String recipientEmail;

    @Column(nullable = false, length = 1000)
    private String text;

    private String type; // chat, match, contract, settlement

    private String time;

    private boolean unread;

    private Long roomId; // optional: link to a chat room / application
}
