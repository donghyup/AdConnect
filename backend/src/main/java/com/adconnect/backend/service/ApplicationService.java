package com.adconnect.backend.service;

import com.adconnect.backend.entity.Application;
import com.adconnect.backend.entity.Campaign;
import com.adconnect.backend.repository.ApplicationRepository;
import com.adconnect.backend.repository.CampaignRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final CampaignRepository campaignRepository;

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

    // Creator cancels (withdraws) their application
    public void delete(Long id) {
        if (!applicationRepository.existsById(id)) {
            throw new IllegalArgumentException("지원 내역을 찾을 수 없습니다.");
        }
        applicationRepository.deleteById(id);
    }

    // Build the 1:1 chat rooms a user can see. Each application is a negotiation
    // thread between one creator and the campaign's advertiser. roomId = application id
    // so the two parties share the exact same room.
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getChatRoomsForUser(String email, String name, String role) {
        List<Map<String, Object>> rooms = new ArrayList<>();

        if ("advertiser".equalsIgnoreCase(role)) {
            // Advertiser: every applicant to each of my campaigns is a room
            List<Campaign> myCampaigns = campaignRepository.findByCompany(name == null ? "" : name);
            for (Campaign campaign : myCampaigns) {
                for (Application app : applicationRepository.findByCampaignId(campaign.getId())) {
                    rooms.add(buildRoom(app, campaign, app.getPartnerName(), app.getPartnerEmail()));
                }
            }
        } else {
            // Creator: each of my applications is a room with that campaign's advertiser
            for (Application app : applicationRepository.findByPartnerEmail(email == null ? "" : email)) {
                Campaign campaign = campaignRepository.findById(app.getCampaignId()).orElse(null);
                String partner = campaign != null ? campaign.getCompany() : "광고주";
                rooms.add(buildRoom(app, campaign, partner, null));
            }
        }
        return rooms;
    }

    private Map<String, Object> buildRoom(Application app, Campaign campaign, String partnerName, String partnerEmail) {
        Map<String, Object> room = new HashMap<>();
        String campaignTitle = campaign != null ? campaign.getTitle() : "캠페인";
        room.put("roomId", app.getId());
        room.put("campaignId", app.getCampaignId());
        room.put("name", partnerName + " (" + campaignTitle + ")");
        room.put("partnerName", partnerName);
        room.put("partnerEmail", partnerEmail == null ? "" : partnerEmail);
        room.put("budget", campaign != null && campaign.getBudget() != null ? campaign.getBudget() : "");
        room.put("status", app.getStatus());
        return room;
    }
}
