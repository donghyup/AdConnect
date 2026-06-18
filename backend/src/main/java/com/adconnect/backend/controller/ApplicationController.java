package com.adconnect.backend.controller;

import com.adconnect.backend.entity.Application;
import com.adconnect.backend.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    // Creator applies to a campaign
    @PostMapping
    public ResponseEntity<?> apply(@RequestBody Map<String, Object> body) {
        Object campaignIdRaw = body.get("campaignId");
        String partnerEmail = (String) body.get("partnerEmail");
        String partnerName = (String) body.get("partnerName");
        String message = (String) body.get("message");

        if (campaignIdRaw == null || partnerEmail == null || partnerEmail.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "지원 정보가 올바르지 않습니다."));
        }

        Long campaignId = Long.valueOf(String.valueOf(campaignIdRaw));
        Application saved = applicationService.apply(campaignId, partnerEmail, partnerName, message);
        return ResponseEntity.ok(saved);
    }

    // Advertiser views applicants for one of their campaigns
    @GetMapping("/campaign/{campaignId}")
    public ResponseEntity<List<Application>> getByCampaign(@PathVariable Long campaignId) {
        return ResponseEntity.ok(applicationService.getApplicationsByCampaign(campaignId));
    }

    // Creator views their own applications
    @GetMapping("/mine")
    public ResponseEntity<List<Application>> getMine(@RequestParam String email) {
        return ResponseEntity.ok(applicationService.getApplicationsByPartner(email));
    }

    // 1:1 chat rooms derived from applications, shared by both parties
    @GetMapping("/rooms")
    public ResponseEntity<List<Map<String, Object>>> getChatRooms(
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String name,
            @RequestParam String role) {
        return ResponseEntity.ok(applicationService.getChatRoomsForUser(email, name, role));
    }

    // Advertiser accepts / rejects an applicant
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            Application updated = applicationService.updateStatus(id, body.get("status"));
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
