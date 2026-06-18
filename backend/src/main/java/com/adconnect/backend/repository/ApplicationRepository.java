package com.adconnect.backend.repository;

import com.adconnect.backend.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByCampaignId(Long campaignId);
    List<Application> findByPartnerEmail(String partnerEmail);
    Optional<Application> findByCampaignIdAndPartnerEmail(Long campaignId, String partnerEmail);
}
