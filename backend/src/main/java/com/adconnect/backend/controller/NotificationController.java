package com.adconnect.backend.controller;

import com.adconnect.backend.entity.Notification;
import com.adconnect.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<Notification>> getForUser(@RequestParam String email) {
        return ResponseEntity.ok(notificationService.getForUser(email));
    }

    @PostMapping
    public ResponseEntity<Notification> create(@RequestBody Map<String, Object> body) {
        String recipientEmail = (String) body.get("recipientEmail");
        String text = (String) body.get("text");
        String type = (String) body.get("type");
        Long roomId = body.get("roomId") != null ? Long.valueOf(String.valueOf(body.get("roomId"))) : null;
        return ResponseEntity.ok(notificationService.create(recipientEmail, text, type, roomId));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<?> markRead(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(notificationService.markRead(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
