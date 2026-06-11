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
