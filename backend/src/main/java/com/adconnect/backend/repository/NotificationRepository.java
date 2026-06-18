package com.adconnect.backend.repository;

import com.adconnect.backend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientEmailOrderByIdDesc(String recipientEmail);
}
