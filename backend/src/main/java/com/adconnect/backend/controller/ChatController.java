package com.adconnect.backend.controller;

import com.adconnect.backend.entity.ChatMessage;
import com.adconnect.backend.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    // REST Fallback endpoint to get messages history
    @GetMapping("/rooms/{roomId}/messages")
    public ResponseEntity<List<ChatMessage>> getMessagesByRoom(@PathVariable Long roomId) {
        List<ChatMessage> history = chatService.getMessagesByRoom(roomId);
        return ResponseEntity.ok(history);
    }

    // Reader opened the room — mark the other party's messages as read
    @PatchMapping("/rooms/{roomId}/read")
    public ResponseEntity<?> markRoomRead(@PathVariable Long roomId, @RequestParam String email) {
        chatService.markRoomRead(roomId, email);
        return ResponseEntity.ok(Map.of("message", "읽음 처리되었습니다."));
    }

    // REST Fallback endpoint to send message
    @PostMapping("/messages/send")
    public ResponseEntity<?> sendMessage(@RequestBody Map<String, Object> request) {
        Long roomId = Long.valueOf(request.get("roomId").toString());
        String sender = request.get("sender").toString();
        String senderEmail = request.get("senderEmail").toString();
        String text = request.get("text").toString();

        ChatMessage saved = chatService.saveAndBroadcast(roomId, sender, senderEmail, text);
        return ResponseEntity.ok(saved);
    }

    // WebSocket STOMP Message Handler
    // Client sends to /app/chat/send
    @MessageMapping("/chat/send")
    public void receiveMessage(Map<String, Object> request) {
        Long roomId = Long.valueOf(request.get("roomId").toString());
        String sender = request.get("sender").toString();
        String senderEmail = request.get("senderEmail").toString();
        String text = request.get("text").toString();

        chatService.saveAndBroadcast(roomId, sender, senderEmail, text);
    }
}
