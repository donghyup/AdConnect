package com.adconnect.backend.service;

import com.adconnect.backend.entity.ChatMessage;
import com.adconnect.backend.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("a h:mm");

    @Transactional(readOnly = true)
    public List<ChatMessage> getMessagesByRoom(Long roomId) {
        return chatMessageRepository.findByRoomIdOrderByIdAsc(roomId);
    }

    public ChatMessage saveAndBroadcast(Long roomId, String sender, String senderEmail, String text) {
        String time = LocalTime.now().format(formatter);

        ChatMessage myMsg = ChatMessage.builder()
                .roomId(roomId)
                .sender(sender)
                .senderEmail(senderEmail)
                .text(text)
                .time(time)
                .build();

        ChatMessage saved = chatMessageRepository.save(myMsg);

        // Broadcast to everyone subscribed to this room so the real counterpart
        // (advertiser ↔ creator) receives it live. No bot/auto-reply — this is a
        // genuine 1:1 conversation between the two matched users.
        try {
            messagingTemplate.convertAndSend("/topic/rooms/" + roomId, saved);
        } catch (Exception e) {
            System.err.println("웹소켓 브로드캐스트 실패 (비연결 상태): " + e.getMessage());
        }

        return saved;
    }
}
