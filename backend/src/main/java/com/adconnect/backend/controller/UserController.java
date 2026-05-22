package com.adconnect.backend.controller;

import com.adconnect.backend.entity.User;
import com.adconnect.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String name = request.get("name");
        String phone = request.get("phone");
        String sns = request.get("sns");

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "사용자 정보를 찾을 수 없습니다."));
        }

        User user = userOpt.get();
        if (name != null) user.setName(name);
        if (phone != null) user.setPhone(phone);
        if (sns != null) user.setSns(sns);

        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "message", "개인정보가 성공적으로 변경되었습니다.",
                "name", user.getName(),
                "phone", user.getPhone(),
                "sns", user.getSns()
        ));
    }

    @PostMapping("/password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String currentPassword = request.get("current");
        String newPassword = request.get("new");

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "사용자 정보를 찾을 수 없습니다."));
        }

        User user = userOpt.get();
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "현재 비밀번호가 일치하지 않습니다."));
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "비밀번호가 안전하게 변경되었습니다."));
    }

    @PostMapping("/withdraw")
    public ResponseEntity<?> withdraw(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String confirmName = request.get("confirmName");

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "사용자 정보를 찾을 수 없습니다."));
        }

        User user = userOpt.get();
        if (!user.getName().equals(confirmName)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "이름/닉네임 입력이 일치하지 않습니다."));
        }

        userRepository.delete(user);

        return ResponseEntity.ok(Map.of("message", "회원 탈퇴가 정상 완료되어 모든 개인정보 세션이 삭제되었습니다."));
    }
}
