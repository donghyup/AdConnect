package com.adconnect.backend.repository;

import com.adconnect.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<User> findByProviderAndProviderId(String provider, String providerId);
    Optional<User> findByGoogleEmail(String googleEmail);
    Optional<User> findByKakaoEmail(String kakaoEmail);
    Optional<User> findByNaverEmail(String naverEmail);
}
