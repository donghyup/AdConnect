package com.adconnect.backend.controller;

import com.adconnect.backend.entity.Campaign;
import com.adconnect.backend.repository.CampaignRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/campaigns")
@RequiredArgsConstructor
public class CampaignController {

    private final CampaignRepository campaignRepository;

    @PostConstruct
    public void initMockCampaigns() {
        if (campaignRepository.count() == 0) {
            campaignRepository.save(Campaign.builder()
                    .company("네오스마트 (Neosmart)")
                    .title("AI 기반 스마트 워치 신제품 리뷰 및 브랜디드 콘텐츠 캠페인")
                    .category("테크/IT")
                    .budget("3,500,000")
                    .subscribersRequired("50,000+")
                    .status("승인 완료")
                    .clicks(1240)
                    .views(45000)
                    .registrations(340)
                    .duration("2026-05-01 ~ 2026-06-01")
                    .description("새롭게 출시되는 AI 탑재 스마트워치 '네오핏 Pro' 제품을 실제 착용하고 1주일간 경험한 장단점을 상세히 파헤쳐줄 크리에이터를 모십니다. 15분 내외의 영상 제작 및 고정 댓글 링크 삽입이 필요합니다.")
                    .genre("테크")
                    .region("서울/수도권")
                    .likes(2450)
                    .comments(312)
                    .build());

            campaignRepository.save(Campaign.builder()
                    .company("헬시푸드 코리아")
                    .title("저당 다이어트 식단 패키지 PPL 광고 및 숏츠 브랜디드 광고")
                    .category("뷰티/헬스")
                    .budget("1,800,000")
                    .subscribersRequired("10,000+")
                    .status("승인 완료")
                    .clicks(840)
                    .views(28000)
                    .registrations(190)
                    .duration("2026-05-15 ~ 2026-06-15")
                    .description("맛있게 즐기는 저당 식단 브랜드를 유튜브 숏츠(Shorts) 또는 메인 영상 내 PPL 형태로 소개해 주실 크리에이터를 찾습니다. 직접 시식하고 다이어트 전후 비교 등을 가볍게 브이로그에 녹여주실 분 선호합니다.")
                    .genre("브이로그")
                    .region("전국")
                    .likes(1890)
                    .comments(154)
                    .build());

            campaignRepository.save(Campaign.builder()
                    .company("플레이아레나")
                    .title("신작 MMORPG '아스달 사가' 사전등록 및 초반 플레이 리뷰 가이드 캠페인")
                    .category("게임")
                    .budget("6,000,000")
                    .subscribersRequired("100,000+")
                    .status("승인 완료")
                    .clicks(3100)
                    .views(112000)
                    .registrations(980)
                    .duration("2026-05-20 ~ 2026-06-20")
                    .description("올해 최대 기대작인 판타지 MMORPG 게임의 초반 성장 팁, 전직 리뷰, 그리고 매력 요소를 전달하는 동영상 마케팅입니다. 타겟 시청자 연령대가 2030 남성인 크리에이터분들의 많은 지원 바랍니다.")
                    .genre("게임")
                    .region("온라인")
                    .likes(5400)
                    .comments(890)
                    .build());

            campaignRepository.save(Campaign.builder()
                    .company("트래블메이트")
                    .title("여름 휴가철 전용 초경량 캐리어 크라우드펀딩 바이럴 홍보 캠페인")
                    .category("일상/여행")
                    .budget("2,200,000")
                    .subscribersRequired("30,000+")
                    .status("승인 대기")
                    .clicks(0)
                    .views(0)
                    .registrations(0)
                    .duration("2026-06-01 ~ 2026-07-01")
                    .description("깨지지 않고 2.1kg에 불과한 신개념 캐리어 크라우드펀딩 오픈 소식을 알리고, 여행지에서 짐을 싸는 현실적인 꿀팁과 함께 제품 노출을 해줄 여행 유튜버를 구합니다.")
                    .genre("여행")
                    .region("전국")
                    .likes(0)
                    .comments(0)
                    .build());
        }
    }

    @GetMapping
    public ResponseEntity<List<Campaign>> getAllCampaigns() {
        return ResponseEntity.ok(campaignRepository.findAll());
    }

    @PostMapping("/create")
    public ResponseEntity<?> createCampaign(@RequestBody Campaign campaign) {
        campaign.setStatus("승인 대기");
        campaign.setClicks(0);
        campaign.setViews(0);
        campaign.setRegistrations(0);
        campaign.setLikes(0);
        campaign.setComments(0);

        Campaign saved = campaignRepository.save(campaign);
        return ResponseEntity.ok(saved);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateCampaignStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String status = request.get("status");

        Optional<Campaign> campaignOpt = campaignRepository.findById(id);
        if (campaignOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Campaign campaign = campaignOpt.get();
        campaign.setStatus(status);
        campaignRepository.save(campaign);

        return ResponseEntity.ok(Map.of("message", "캠페인 상태가 '" + status + "'(으)로 업데이트되었습니다."));
    }
}
