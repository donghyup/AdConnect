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

    @PostConstruct
    public void initChatHistory() {
        if (chatMessageRepository.count() == 0) {
            // Room 1 (NeoSmart) initial chat seeds
            chatMessageRepository.save(ChatMessage.builder().roomId(1L).sender("them").senderEmail("mj.kim@neosmart.com").text("안녕하세요! 네오스마트 마케팅팀 김민준 팀장입니다. AI 스마트워치 광고 캠페인 매칭 축하드립니다.").time("오전 10:15").build());
            chatMessageRepository.save(ChatMessage.builder().roomId(1L).sender("me").senderEmail("j-creator@gmail.com").text("감사합니다! 제품 강점인 AI 헬스케어 비서 기능을 일상 속 상황극에 녹여보려 하는데 의견이 어떠신가요?").time("오전 10:30").build());
            chatMessageRepository.save(ChatMessage.builder().roomId(1L).sender("them").senderEmail("mj.kim@neosmart.com").text("기존의 뻔한 스펙 설명보다 상황극 형식이 훨씬 몰입도가 높을 것 같아 적극 찬성합니다!").time("오전 10:45").build());
            chatMessageRepository.save(ChatMessage.builder().roomId(1L).sender("me").senderEmail("j-creator@gmail.com").text("그럼 상황 시나리오 및 스토리보드 작성해서 오늘 중으로 먼저 보내드리겠습니다.").time("오전 11:00").build());
            chatMessageRepository.save(ChatMessage.builder().roomId(1L).sender("them").senderEmail("mj.kim@neosmart.com").text("네, 크리에이터님! 제안해주신 스토리보드 기획안이 아주 만족스럽습니다.").time("오전 11:20").build());

            // Room 2 (PlayArena) initial chat seeds
            chatMessageRepository.save(ChatMessage.builder().roomId(2L).sender("them").senderEmail("ls.woo@playarena.com").text("안녕하세요 게임 크리에이터님! 신작 MMORPG 리뷰 광고 관련하여 대화 드립니다.").time("어제 오후 2:00").build());
            chatMessageRepository.save(ChatMessage.builder().roomId(2L).sender("me").senderEmail("j-creator@gmail.com").text("반갑습니다 본부장님! 사전등록 유입 링크는 영상 본문과 고정댓글 두 곳 모두 적용하면 될까요?").time("어제 오후 2:15").build());
            chatMessageRepository.save(ChatMessage.builder().roomId(2L).sender("them").senderEmail("ls.woo@playarena.com").text("네, 정확합니다! 추가로 플레이 도중 사용할 수 있는 한정판 쿠폰코드 정보도 함께 삽입될 예정입니다.").time("어제 오후 2:30").build());
            chatMessageRepository.save(ChatMessage.builder().roomId(2L).sender("them").senderEmail("ls.woo@playarena.com").text("계약서 초안을 업로드 해드렸으니 전자 서명 진행해 주시면 감사하겠습니다.").time("어제 오후 3:00").build());
        }
    }

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
