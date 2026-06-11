package com.adconnect.backend.controller;

import com.adconnect.backend.entity.User;
import com.adconnect.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String name = request.get("name");
        String phone = request.get("phone");
        String sns = request.get("sns");

        try {
            User user = userService.updateProfile(email, name, phone, sns);
            return ResponseEntity.ok(Map.of(
                    "message", "개인정보가 성공적으로 변경되었습니다.",
                    "name", user.getName(),
                    "phone", user.getPhone(),
                    "sns", user.getSns()
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String currentPassword = request.get("current");
        String newPassword = request.get("new");

        try {
            userService.changePassword(email, currentPassword, newPassword);
            return ResponseEntity.ok(Map.of("message", "비밀번호가 안전하게 변경되었습니다."));
        } catch (IllegalArgumentException e) {
            HttpStatus status = e.getMessage().contains("찾을 수 없습니다") ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST;
            return ResponseEntity.status(status).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/withdraw")
    public ResponseEntity<?> withdraw(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String confirmName = request.get("confirmName");

        try {
            userService.withdraw(email, confirmName);
            return ResponseEntity.ok(Map.of("message", "회원 탈퇴가 정상 완료되어 모든 개인정보 세션이 삭제되었습니다."));
        } catch (IllegalArgumentException e) {
            HttpStatus status = e.getMessage().contains("찾을 수 없습니다") ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST;
            return ResponseEntity.status(status).body(Map.of("message", e.getMessage()));
        }
    }
}
