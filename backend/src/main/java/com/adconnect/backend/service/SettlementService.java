package com.adconnect.backend.service;

import com.adconnect.backend.entity.Settlement;
import com.adconnect.backend.repository.SettlementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class SettlementService {

    public static final String PENDING = "예치 대기";
    public static final String DEPOSITED = "예치 완료";
    public static final String SUBMITTED = "작업 완료";
    public static final String SETTLED = "정산 완료";

    private final SettlementRepository settlementRepository;

    @Transactional(readOnly = true)
    public Optional<Settlement> getByApplication(Long applicationId) {
        return settlementRepository.findByApplicationId(applicationId);
    }

    @Transactional(readOnly = true)
    public List<Settlement> getForUser(String email, String name, String role) {
        if ("advertiser".equalsIgnoreCase(role)) {
            return settlementRepository.findByAdvertiserName(name == null ? "" : name);
        }
        return settlementRepository.findByCreatorEmail(email == null ? "" : email);
    }

    // Advertiser deposits the escrow amount. Creates the settlement if needed and
    // moves it to 예치 완료.
    public Settlement deposit(Long applicationId, Long campaignId, String projectName,
                              String advertiserName, String creatorName, String creatorEmail, String amount) {
        Settlement settlement = settlementRepository.findByApplicationId(applicationId)
                .orElseGet(() -> Settlement.builder()
                        .applicationId(applicationId)
                        .campaignId(campaignId)
                        .projectName(projectName)
                        .advertiserName(advertiserName)
                        .creatorName(creatorName)
                        .creatorEmail(creatorEmail)
                        .amount(amount)
                        .status(PENDING)
                        .createdAt(LocalDate.now().toString())
                        .build());

        // Keep details fresh, then mark deposited
        settlement.setCampaignId(campaignId);
        if (projectName != null) settlement.setProjectName(projectName);
        if (advertiserName != null) settlement.setAdvertiserName(advertiserName);
        if (creatorName != null) settlement.setCreatorName(creatorName);
        if (creatorEmail != null) settlement.setCreatorEmail(creatorEmail);
        if (amount != null) settlement.setAmount(amount);
        settlement.setStatus(DEPOSITED);

        return settlementRepository.save(settlement);
    }

    // Creator marks the work as delivered (only after deposit).
    public Settlement submitWork(Long id) {
        Settlement settlement = settlementRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("정산 내역을 찾을 수 없습니다."));
        if (!DEPOSITED.equals(settlement.getStatus()) && !SUBMITTED.equals(settlement.getStatus())) {
            throw new IllegalStateException("보증금 예치 완료 후에만 작업물을 제출할 수 있습니다.");
        }
        settlement.setStatus(SUBMITTED);
        return settlementRepository.save(settlement);
    }

    // Advertiser approves and releases the payout to the creator.
    public Settlement approve(Long id) {
        Settlement settlement = settlementRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("정산 내역을 찾을 수 없습니다."));
        if (!SUBMITTED.equals(settlement.getStatus())) {
            throw new IllegalStateException("크리에이터의 작업물 제출 후에만 정산 승인이 가능합니다.");
        }
        settlement.setStatus(SETTLED);
        return settlementRepository.save(settlement);
    }
}
