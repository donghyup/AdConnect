package com.adconnect.backend.repository;

import com.adconnect.backend.entity.Settlement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SettlementRepository extends JpaRepository<Settlement, Long> {
    Optional<Settlement> findByApplicationId(Long applicationId);
    List<Settlement> findByCreatorEmail(String creatorEmail);
    List<Settlement> findByAdvertiserName(String advertiserName);
}
