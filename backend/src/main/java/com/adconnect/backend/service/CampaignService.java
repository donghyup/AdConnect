package com.adconnect.backend.service;

import com.adconnect.backend.entity.Campaign;
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
}
