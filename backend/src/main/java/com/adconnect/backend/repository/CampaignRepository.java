package com.adconnect.backend.repository;

import com.adconnect.backend.entity.Campaign;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CampaignRepository extends JpaRepository<Campaign, Long> {
    List<Campaign> findByCompany(String company);
    List<Campaign> findByStatus(String status);
}
