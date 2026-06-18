package com.adconnect.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "chat_messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long roomId;

    @Column(nullable = false)
    private String sender; // 'me' or 'them' relative to UI perspective, or just a dynamic sender identifier. 
    // To make it simple and perfectly aligned with our React structure: me | them relative to a specific session, 
    // or just the email of the sender.
    
    private String senderEmail;

    @Column(nullable = false, length = 1000)
    private String text;

    private String time;

    // Read receipt: true once the other party has opened the room and seen it.
    // Column renamed to avoid the SQL reserved word "read".
    @Column(name = "is_read")
    private boolean read;
}
