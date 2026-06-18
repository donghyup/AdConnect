package com.adconnect.backend.controller;

import com.adconnect.backend.entity.Campaign;
import com.adconnect.backend.service.CampaignService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/campaigns")
@RequiredArgsConstructor
public class CampaignController {

    private final CampaignService campaignService;

    @GetMapping
    public ResponseEntity<List<Campaign>> getAllCampaigns() {
        return ResponseEntity.ok(campaignService.getAllCampaigns());
    }

    @PostMapping("/create")
    public ResponseEntity<?> createCampaign(@RequestBody Campaign campaign) {
        Campaign saved = campaignService.createCampaign(campaign);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCampaign(@PathVariable Long id, @RequestBody Campaign data) {
        try {
            return ResponseEntity.ok(campaignService.updateCampaign(id, data));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409).body(Map.of("message", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateCampaignStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String status = request.get("status");

        try {
            campaignService.updateCampaignStatus(id, status);
            return ResponseEntity.ok(Map.of("message", "캠페인 상태가 '" + status + "'(으)로 업데이트되었습니다."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
