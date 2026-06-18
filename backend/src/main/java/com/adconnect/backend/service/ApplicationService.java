package com.adconnect.backend.service;

import com.adconnect.backend.entity.Application;
import com.adconnect.backend.repository.ApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class ApplicationService {

    private final ApplicationRepository applicationRepository;

    // Creator applies to a campaign. Re-applying to the same campaign is a no-op
    // (returns the existing application) so applicants can't be duplicated.
    public Application apply(Long campaignId, String partnerEmail, String partnerName, String message) {
        Optional<Application> existing = applicationRepository.findByCampaignIdAndPartnerEmail(campaignId, partnerEmail);
        if (existing.isPresent()) {
            return existing.get();
        }
        Application application = Application.builder()
                .campaignId(campaignId)
                .partnerEmail(partnerEmail)
                .partnerName(partnerName == null ? partnerEmail : partnerName)
                .message(message == null ? "" : message)
                .status("대기")
                .build();
        return applicationRepository.save(application);
    }

    @Transactional(readOnly = true)
    public List<Application> getApplicationsByCampaign(Long campaignId) {
        return applicationRepository.findByCampaignId(campaignId);
    }

    @Transactional(readOnly = true)
    public List<Application> getApplicationsByPartner(String partnerEmail) {
        return applicationRepository.findByPartnerEmail(partnerEmail);
    }

    public Application updateStatus(Long id, String status) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("지원 내역을 찾을 수 없습니다."));
        application.setStatus(status);
        return applicationRepository.save(application);
    }
}
