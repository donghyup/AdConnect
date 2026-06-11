package com.adconnect.backend.controller;

import com.adconnect.backend.entity.ChatMessage;
import com.adconnect.backend.repository.ChatMessageRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatMessageRepository chatMessageRepository;
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("a h:mm");

    @GetMapping("/rooms/{roomId}/messages")
    public ResponseEntity<List<ChatMessage>> getMessagesByRoom(@PathVariable Long roomId) {
        List<ChatMessage> history = chatMessageRepository.findByRoomIdOrderByIdAsc(roomId);
        return ResponseEntity.ok(history);
    }

    @PostMapping("/messages/send")
    public ResponseEntity<?> sendMessage(@RequestBody Map<String, Object> request) {
        Long roomId = Long.valueOf(request.get("roomId").toString());
        String sender = request.get("sender").toString();
        String senderEmail = request.get("senderEmail").toString();
        String text = request.get("text").toString();
        String time = LocalTime.now().format(formatter);

        ChatMessage myMsg = ChatMessage.builder()
                .roomId(roomId)
                .sender(sender)
                .senderEmail(senderEmail)
                .text(text)
                .time(time)
                .build();

        chatMessageRepository.save(myMsg);

        // Simulated auto response based on room logic
        new Thread(() -> {
            try {
                Thread.sleep(1500); // 1.5 Seconds delay to simulate real network typing delay
                
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

                chatMessageRepository.save(replyMsg);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }).start();

        return ResponseEntity.ok(myMsg);
    }
}
