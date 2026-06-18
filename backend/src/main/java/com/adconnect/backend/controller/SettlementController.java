package com.adconnect.backend.controller;

import com.adconnect.backend.entity.Settlement;
import com.adconnect.backend.service.SettlementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/settlements")
@RequiredArgsConstructor
public class SettlementController {

    private final SettlementService settlementService;

    // Current settlement for a matched application (null body if none yet)
    @GetMapping("/application/{applicationId}")
    public ResponseEntity<Settlement> getByApplication(@PathVariable Long applicationId) {
        return ResponseEntity.ok(settlementService.getByApplication(applicationId).orElse(null));
    }

    // A user's settlements (advertiser by name, creator by email)
    @GetMapping
    public ResponseEntity<List<Settlement>> getForUser(
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String name,
            @RequestParam String role) {
        return ResponseEntity.ok(settlementService.getForUser(email, name, role));
    }

    // Advertiser deposits the escrow amount -> 예치 완료
    @PostMapping("/deposit")
    public ResponseEntity<?> deposit(@RequestBody Map<String, Object> body) {
        Object appIdRaw = body.get("applicationId");
        if (appIdRaw == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "applicationId가 필요합니다."));
        }
        Long applicationId = Long.valueOf(String.valueOf(appIdRaw));
        Long campaignId = body.get("campaignId") != null ? Long.valueOf(String.valueOf(body.get("campaignId"))) : null;
        Settlement saved = settlementService.deposit(
                applicationId,
                campaignId,
                (String) body.get("projectName"),
                (String) body.get("advertiserName"),
                (String) body.get("creatorName"),
                (String) body.get("creatorEmail"),
                (String) body.get("amount")
        );
        return ResponseEntity.ok(saved);
    }

    // Creator submits the delivered work -> 작업 완료
    @PatchMapping("/{id}/submit")
    public ResponseEntity<?> submit(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(settlementService.submitWork(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Advertiser approves and releases payout -> 정산 완료
    @PatchMapping("/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(settlementService.approve(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
