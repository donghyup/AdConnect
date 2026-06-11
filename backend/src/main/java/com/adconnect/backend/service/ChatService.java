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

        // Broadcast original message to WebSocket subscribers
        try {
            messagingTemplate.convertAndSend("/topic/rooms/" + roomId, saved);
        } catch (Exception e) {
            System.err.println("웹소켓 브로드캐스트 실패 (비연결 상태): " + e.getMessage());
        }

        // Trigger background auto response
        triggerAutoReply(roomId, text);

        return saved;
    }

    private void triggerAutoReply(Long roomId, String text) {
        new Thread(() -> {
            try {
                Thread.sleep(1500); // 1.5 seconds typing delay simulation
                
                String replyText = "확인했습니다. 곧 검토 후 피드백 드리겠습니다!";
                String partnerEmail = "mj.kim@neosmart.com";
                
                if (roomId == 1L) {
                    if (text.contains("시나리오") || text.contains("스토리보드")) {
                        replyText = "좋습니다! 전달해주시는 스토리보드 시안 보고 가이드 라인에 맞는지 팀 회의 거쳐서 최종 승인해 드릴게요. 꼼꼼히 챙겨주셔서 고맙습니다.";
                    } else if (text.contains("계약") || text.contains("서명")) {
                        replyText = "네, 정산금 결제와 동시에 전자 서명이 함께 저장되도록 연동되어 있습니다. 진행 후 말씀해 주세요.";
                    }
                } else if (roomId == 2L) {
                    replyText = "포트원 결제 연동 모듈을 통해 안전하게 에스크로 결제 완료되는대로 최종 촬영 착수해주시면 됩니다.";
                    partnerEmail = "ls.woo@playarena.com";
                }

                ChatMessage replyMsg = ChatMessage.builder()
                        .roomId(roomId)
                        .sender("them")
                        .senderEmail(partnerEmail)
                        .text(replyText)
                        .time(LocalTime.now().format(formatter))
                        .build();

                ChatMessage savedReply = chatMessageRepository.save(replyMsg);

                // Broadcast auto response to WebSocket subscribers
                try {
                    messagingTemplate.convertAndSend("/topic/rooms/" + roomId, savedReply);
                } catch (Exception e) {
                    System.err.println("웹소켓 브로드캐스트 실패 (비연결 상태): " + e.getMessage());
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }).start();
    }
}
