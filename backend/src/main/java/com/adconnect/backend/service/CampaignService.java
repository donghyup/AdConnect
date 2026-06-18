package com.adconnect.backend.service;

import com.adconnect.backend.entity.Campaign;
import com.adconnect.backend.repository.ApplicationRepository;
import com.adconnect.backend.repository.CampaignRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class CampaignService {

    private final CampaignRepository campaignRepository;
    private final ApplicationRepository applicationRepository;

    @Transactional(readOnly = true)
    public List<Campaign> getAllCampaigns() {
        return campaignRepository.findAll();
    }

    public Campaign createCampaign(Campaign campaign) {
        campaign.setStatus("승인 대기");
        campaign.setClicks(0);
        campaign.setViews(0);
        campaign.setRegistrations(0);
        campaign.setLikes(0);
        campaign.setComments(0);

        return campaignRepository.save(campaign);
    }

    public Campaign updateCampaignStatus(Long id, String status) {
        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("캠페인 정보를 찾을 수 없습니다."));

        campaign.setStatus(status);
        return campaignRepository.save(campaign);
    }

    public void deleteCampaign(Long id) {
        if (!campaignRepository.existsById(id)) {
            throw new IllegalArgumentException("캠페인 정보를 찾을 수 없습니다.");
        }
        campaignRepository.deleteById(id);
    }

    // Edit a campaign's details. Blocked once anyone has applied so terms can't
    // change out from under applicants. Status and counters are preserved.
    public Campaign updateCampaign(Long id, Campaign data) {
        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("캠페인 정보를 찾을 수 없습니다."));

        if (!applicationRepository.findByCampaignId(id).isEmpty()) {
            throw new IllegalStateException("이미 지원자가 있는 캠페인은 수정할 수 없습니다.");
        }

        if (data.getTitle() != null) campaign.setTitle(data.getTitle());
        if (data.getCategory() != null) campaign.setCategory(data.getCategory());
        if (data.getBudget() != null) campaign.setBudget(data.getBudget());
        if (data.getSubscribersRequired() != null) campaign.setSubscribersRequired(data.getSubscribersRequired());
        if (data.getDuration() != null) campaign.setDuration(data.getDuration());
        if (data.getDescription() != null) campaign.setDescription(data.getDescription());
        if (data.getGenre() != null) campaign.setGenre(data.getGenre());
        if (data.getRegion() != null) campaign.setRegion(data.getRegion());

        return campaignRepository.save(campaign);
    }
}
