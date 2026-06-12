package com.adconnect.backend.service;

import com.adconnect.backend.entity.User;
import com.adconnect.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User updateProfile(String email, String name, String phone, String sns) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자 정보를 찾을 수 없습니다."));

        if (name != null) user.setName(name);
        if (phone != null) user.setPhone(phone);
        if (sns != null) user.setSns(sns);

        return userRepository.save(user);
    }

    public void changePassword(String email, String currentPassword, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자 정보를 찾을 수 없습니다."));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public void withdraw(String email, String confirmName) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자 정보를 찾을 수 없습니다."));

        if (!user.getName().equals(confirmName)) {
            throw new IllegalArgumentException("이름/닉네임 입력이 일치하지 않습니다.");
        }

        userRepository.delete(user);
    }

    public User getOrCreateSocialUser(String provider, String providerId, String email, String name) {
        // 1. Search by provider and providerId
        Optional<User> userOpt = userRepository.findByProviderAndProviderId(provider, providerId);
        if (userOpt.isPresent()) {
            return userOpt.get();
        }

        // 2. Search by email. If already exists (local account), merge oauth mapping
        Optional<User> emailUserOpt = userRepository.findByEmail(email);
        if (emailUserOpt.isPresent()) {
            User existingUser = emailUserOpt.get();
            existingUser.setProvider(provider);
            existingUser.setProviderId(providerId);
            return userRepository.save(existingUser);
        }

        // 3. Create a new social user with mock password (default role: creator)
        User newUser = User.builder()
                .email(email)
                .name(name)
                .password(passwordEncoder.encode("OAUTH_USER_" + java.util.UUID.randomUUID().toString()))
                .role("creator")
                .provider(provider)
                .providerId(providerId)
                .phone("미등록")
                .sns("미등록")
                .build();

        return userRepository.save(newUser);
    }
}
