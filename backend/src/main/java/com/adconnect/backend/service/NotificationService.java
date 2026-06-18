package com.adconnect.backend.service;

import com.adconnect.backend.entity.Notification;
import com.adconnect.backend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("a h:mm");

    @Transactional(readOnly = true)
    public List<Notification> getForUser(String email) {
        return notificationRepository.findByRecipientEmailOrderByIdDesc(email == null ? "" : email);
    }

    public Notification create(String recipientEmail, String text, String type, Long roomId) {
        Notification notification = Notification.builder()
                .recipientEmail(recipientEmail)
                .text(text)
                .type(type == null ? "info" : type)
                .time(LocalTime.now().format(formatter))
                .unread(true)
                .roomId(roomId)
                .build();
        return notificationRepository.save(notification);
    }

    public Notification markRead(Long id) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("알림을 찾을 수 없습니다."));
        n.setUnread(false);
        return notificationRepository.save(n);
    }
}
