package com.adconnect.backend.controller;

import com.adconnect.backend.entity.User;
import com.adconnect.backend.repository.UserRepository;
import com.adconnect.backend.security.JwtTokenProvider;
import com.adconnect.backend.service.UserService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;
    private final Map<String, String> otpStorage = new java.util.concurrent.ConcurrentHashMap<>();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${emailjs.service-id}")
    private String serviceId;

    @Value("${emailjs.template-id}")
    private String templateId;

    @Value("${emailjs.public-key}")
    private String publicKey;

    @Value("${emailjs.private-key}")
    private String privateKey;

    @Value("${oauth2.kakao.client-id}")
    private String kakaoClientId;

    @Value("${oauth2.kakao.client-secret}")
    private String kakaoClientSecret;

    @Value("${oauth2.kakao.redirect-uri}")
    private String kakaoRedirectUri;

    @Value("${oauth2.google.client-id}")
    private String googleClientId;

    @Value("${oauth2.google.client-secret}")
    private String googleClientSecret;

    @Value("${oauth2.google.redirect-uri}")
    private String googleRedirectUri;

    @Value("${oauth2.naver.client-id}")
    private String naverClientId;

    @Value("${oauth2.naver.client-secret}")
    private String naverClientSecret;

    @Value("${oauth2.naver.redirect-uri}")
    private String naverRedirectUri;


    // Bootstrapping mock users disabled for clean production database
    // @PostConstruct
    // public void initMockUsers() {
    //     if (!userRepository.existsByEmail("j-creator@gmail.com")) {
    //         userRepository.save(User.builder()
    //                 .email("j-creator@gmail.com")
    //                 .password(passwordEncoder.encode("password123"))
    //                 .name("크리에이터 제이 (J)")
    //                 .role("creator")
    //                 .phone("010-1234-5678")
    //                 .sns("youtube.com/c/creator_j")
    //                 .build());
    //     }
    //     if (!userRepository.existsByEmail("mj.kim@neosmart.com")) {
    //         userRepository.save(User.builder()
    //                 .email("mj.kim@neosmart.com")
    //                 .password(passwordEncoder.encode("password123"))
    //                 .name("네오스마트 (김민준 팀장)")
    //                 .role("advertiser")
    //                 .phone("02-555-9876")
    //                 .sns("neosmart.ai")
    //                 .build());
    //     }
    //     if (!userRepository.existsByEmail("admin@ad-connect.com")) {
    //         userRepository.save(User.builder()
    //                 .email("admin@ad-connect.com")
    //                 .password(passwordEncoder.encode("password123"))
    //                 .name("최고 관리자 (Admin)")
    //                 .role("admin")
    //                 .phone("02-1234-5678")
    //                 .sns("ad-connect.com/admin")
    //                 .build());
    //     }
    // }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User userDto) {
        if (userRepository.existsByEmail(userDto.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "이미 존재하는 이메일 계정입니다."));
        }

        User newUser = User.builder()
                .email(userDto.getEmail())
                .password(passwordEncoder.encode(userDto.getPassword()))
                .name(userDto.getName())
                .role(userDto.getRole())
                .phone(userDto.getPhone())
                .sns(userDto.getSns())
                .build();

        userRepository.save(newUser);
        return ResponseEntity.ok(Map.of("message", "회원가입이 정상 완료되었습니다."));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty() || !passwordEncoder.matches(password, userOpt.get().getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "등록되지 않은 계정이거나 비밀번호가 일치하지 않습니다."));
        }

        // Generate random 6-digit OTP
        String otp = String.format("%06d", new java.util.Random().nextInt(1000000));
        otpStorage.put(email, otp);

        try {
            HttpClient client = HttpClient.newHttpClient();
            String jsonBody = "{"
                    + "\"service_id\":\"" + serviceId + "\","
                    + "\"template_id\":\"" + templateId + "\","
                    + "\"user_id\":\"" + publicKey + "\","
                    + "\"accessToken\":\"" + privateKey + "\","
                    + "\"template_params\":{"
                    + "\"to_email\":\"" + email + "\","
                    + "\"otp_code\":\"" + otp + "\""
                    + "}"
                    + "}";

            HttpRequest apiRequest = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.emailjs.com/api/v1.0/email/send"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody, StandardCharsets.UTF_8))
                    .build();

            HttpResponse<String> apiResponse = client.send(apiRequest, HttpResponse.BodyHandlers.ofString());

            if (apiResponse.statusCode() >= 300) {
                throw new RuntimeException("EmailJS API returned status code " + apiResponse.statusCode() + ": " + apiResponse.body());
            }
        } catch (Exception e) {
            System.err.println("EmailJS 메일 전송 실패: " + e.getMessage());
            System.out.println("[SMTP 전송 실패 디버그용] 생성된 OTP: " + otp);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "2차 인증 메일 발송 중 오류가 발생했습니다. API 설정을 확인해주세요: " + e.getMessage()));
        }

        // Send OTP (Without returning otp in the JSON response!)
        return ResponseEntity.ok(Map.of(
                "message", "이메일로 6자리 2차 OTP 인증 번호가 발송되었습니다.",
                "email", email,
                "tempPass", "true"
        ));
    }

    @PostMapping("/otp/verify")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");

        if (otp == null || otp.length() < 6) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "올바른 6자리 OTP 인증번호를 입력해 주십시오."));
        }

        String storedOtp = otpStorage.get(email);
        if (storedOtp == null || !storedOtp.equals(otp)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "OTP 인증번호가 올바르지 않거나 만료되었습니다."));
        }
        otpStorage.remove(email); // consume OTP

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "사용자 계정을 찾을 수 없습니다."));
        }

        User user = userOpt.get();
        String token = jwtTokenProvider.createToken(user.getEmail(), user.getRole());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("role", user.getRole());
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("phone", user.getPhone());
        response.put("sns", user.getSns());
        response.put("googleEmail", user.getGoogleEmail() == null ? "" : user.getGoogleEmail());
        response.put("kakaoEmail", user.getKakaoEmail() == null ? "" : user.getKakaoEmail());
        response.put("naverEmail", user.getNaverEmail() == null ? "" : user.getNaverEmail());
        response.put("message", "2차 보안 인증 및 로그인이 정상 완료되었습니다.");

        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/heartbeat")
    public ResponseEntity<?> heartbeat() {
        return ResponseEntity.ok(Map.of("status", "UP", "wsStatus", "CONNECTED"));
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> request) {
        String code = request.get("code");
        if (code == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "인가 코드가 누락되었습니다."));
        }

        try {
            HttpClient client = HttpClient.newHttpClient();
            
            String tokenRequestBody = "code=" + code
                    + "&client_id=" + googleClientId
                    + "&client_secret=" + googleClientSecret
                    + "&redirect_uri=" + googleRedirectUri
                    + "&grant_type=authorization_code";

            HttpRequest tokenRequest = HttpRequest.newBuilder()
                    .uri(URI.create("https://oauth2.googleapis.com/token"))
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .POST(HttpRequest.BodyPublishers.ofString(tokenRequestBody))
                    .build();

            HttpResponse<String> tokenResponse = client.send(tokenRequest, HttpResponse.BodyHandlers.ofString());
            if (tokenResponse.statusCode() >= 300) {
                return ResponseEntity.status(tokenResponse.statusCode())
                        .body(Map.of("message", "구글 토큰 획득 실패: " + tokenResponse.body()));
            }

            String body = tokenResponse.body();
            String accessToken = extractJsonValue(body, "access_token");

            HttpRequest profileRequest = HttpRequest.newBuilder()
                    .uri(URI.create("https://www.googleapis.com/oauth2/v2/userinfo"))
                    .header("Authorization", "Bearer " + accessToken)
                    .GET()
                    .build();

            HttpResponse<String> profileResponse = client.send(profileRequest, HttpResponse.BodyHandlers.ofString());
            if (profileResponse.statusCode() >= 300) {
                return ResponseEntity.status(profileResponse.statusCode())
                        .body(Map.of("message", "구글 프로필 정보 획득 실패: " + profileResponse.body()));
            }

            String profileBody = profileResponse.body();
            JsonNode rootNode = objectMapper.readTree(profileBody);
            String email = rootNode.has("email") ? rootNode.get("email").asText() : "";
            String name = rootNode.has("name") ? rootNode.get("name").asText() : "";
            String providerId = rootNode.has("id") ? rootNode.get("id").asText() : "";

            User user = userService.getOrCreateSocialUser("google", providerId, email, name);
            String token = jwtTokenProvider.createToken(user.getEmail(), user.getRole());

            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "role", user.getRole(),
                    "name", user.getName(),
                    "email", user.getEmail(),
                    "phone", user.getPhone(),
                    "sns", user.getSns(),
                    "googleEmail", user.getGoogleEmail() == null ? "" : user.getGoogleEmail(),
                    "kakaoEmail", user.getKakaoEmail() == null ? "" : user.getKakaoEmail(),
                    "naverEmail", user.getNaverEmail() == null ? "" : user.getNaverEmail(),
                    "message", "구글 소셜 로그인 연동이 정상 완료되었습니다."
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "구글 소셜 로그인 연동 처리 중 서버 에러 발생: " + e.getMessage()));
        }
    }

    @PostMapping("/kakao")
    public ResponseEntity<?> kakaoLogin(@RequestBody Map<String, String> request) {
        String code = request.get("code");
        if (code == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "인가 코드가 누락되었습니다."));
        }

        try {
            HttpClient client = HttpClient.newHttpClient();

            String tokenRequestBody = "grant_type=authorization_code"
                    + "&client_id=" + kakaoClientId
                    + "&client_secret=" + kakaoClientSecret
                    + "&redirect_uri=" + kakaoRedirectUri
                    + "&code=" + code;

            HttpRequest tokenRequest = HttpRequest.newBuilder()
                    .uri(URI.create("https://kauth.kakao.com/oauth/token"))
                    .header("Content-Type", "application/x-www-form-urlencoded;charset=utf-8")
                    .POST(HttpRequest.BodyPublishers.ofString(tokenRequestBody))
                    .build();

            HttpResponse<String> tokenResponse = client.send(tokenRequest, HttpResponse.BodyHandlers.ofString());
            if (tokenResponse.statusCode() >= 300) {
                return ResponseEntity.status(tokenResponse.statusCode())
                        .body(Map.of("message", "카카오 토큰 획득 실패: " + tokenResponse.body()));
            }

            String body = tokenResponse.body();
            String accessToken = extractJsonValue(body, "access_token");

            HttpRequest profileRequest = HttpRequest.newBuilder()
                    .uri(URI.create("https://kapi.kakao.com/v2/user/me"))
                    .header("Authorization", "Bearer " + accessToken)
                    .header("Content-Type", "application/x-www-form-urlencoded;charset=utf-8")
                    .GET()
                    .build();

            HttpResponse<String> profileResponse = client.send(profileRequest, HttpResponse.BodyHandlers.ofString());
            if (profileResponse.statusCode() >= 300) {
                return ResponseEntity.status(profileResponse.statusCode())
                        .body(Map.of("message", "카카오 프로필 정보 획득 실패: " + profileResponse.body()));
            }

            String profileBody = profileResponse.body();
            JsonNode rootNode = objectMapper.readTree(profileBody);
            String providerId = rootNode.has("id") ? rootNode.get("id").asText() : "";
            String email = providerId + "@kakao.com";
            String name = "카카오유저_" + (providerId.length() > 5 ? providerId.substring(0, 5) : providerId);
            
            if (rootNode.has("kakao_account")) {
                JsonNode accountNode = rootNode.get("kakao_account");
                if (accountNode.has("email")) {
                    email = accountNode.get("email").asText();
                }
                if (accountNode.has("profile")) {
                    JsonNode profileNode = accountNode.get("profile");
                    if (profileNode.has("nickname")) {
                        name = profileNode.get("nickname").asText();
                    }
                }
            } else if (rootNode.has("properties")) {
                JsonNode propsNode = rootNode.get("properties");
                if (propsNode.has("nickname")) {
                    name = propsNode.get("nickname").asText();
                }
            }

            User user = userService.getOrCreateSocialUser("kakao", providerId, email, name);
            String token = jwtTokenProvider.createToken(user.getEmail(), user.getRole());

            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "role", user.getRole(),
                    "name", user.getName(),
                    "email", user.getEmail(),
                    "phone", user.getPhone(),
                    "sns", user.getSns(),
                    "googleEmail", user.getGoogleEmail() == null ? "" : user.getGoogleEmail(),
                    "kakaoEmail", user.getKakaoEmail() == null ? "" : user.getKakaoEmail(),
                    "naverEmail", user.getNaverEmail() == null ? "" : user.getNaverEmail(),
                    "message", "카카오 소셜 로그인 연동이 정상 완료되었습니다."
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "카카오 소셜 로그인 연동 처리 중 서버 에러 발생: " + e.getMessage()));
        }
    }

    @PostMapping("/naver")
    public ResponseEntity<?> naverLogin(@RequestBody Map<String, String> request) {
        String code = request.get("code");
        String state = request.get("state");
        if (state == null) {
            state = "adconnect12345";
        }
        if (code == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "인가 코드가 누락되었습니다."));
        }

        try {
            HttpClient client = HttpClient.newHttpClient();

            String tokenUrl = "https://nid.naver.com/oauth2.0/token?grant_type=authorization_code"
                    + "&client_id=" + naverClientId
                    + "&client_secret=" + naverClientSecret
                    + "&code=" + code
                    + "&state=" + state;

            HttpRequest tokenRequest = HttpRequest.newBuilder()
                    .uri(URI.create(tokenUrl))
                    .GET()
                    .build();

            HttpResponse<String> tokenResponse = client.send(tokenRequest, HttpResponse.BodyHandlers.ofString());
            if (tokenResponse.statusCode() >= 300) {
                return ResponseEntity.status(tokenResponse.statusCode())
                        .body(Map.of("message", "네이버 토큰 획득 실패: " + tokenResponse.body()));
            }

            String body = tokenResponse.body();
            String accessToken = extractJsonValue(body, "access_token");

            HttpRequest profileRequest = HttpRequest.newBuilder()
                    .uri(URI.create("https://openapi.naver.com/v1/nid/me"))
                    .header("Authorization", "Bearer " + accessToken)
                    .GET()
                    .build();

            HttpResponse<String> profileResponse = client.send(profileRequest, HttpResponse.BodyHandlers.ofString());
            if (profileResponse.statusCode() >= 300) {
                return ResponseEntity.status(profileResponse.statusCode())
                        .body(Map.of("message", "네이버 프로필 정보 획득 실패: " + profileResponse.body()));
            }

            String profileBody = profileResponse.body();
            JsonNode rootNode = objectMapper.readTree(profileBody);
            String providerId = "";
            String email = "";
            String name = "";

            if (rootNode.has("response")) {
                JsonNode responseNode = rootNode.get("response");
                providerId = responseNode.has("id") ? responseNode.get("id").asText() : "";
                email = responseNode.has("email") ? responseNode.get("email").asText() : "";
                name = responseNode.has("name") ? responseNode.get("name").asText() : "";
            }

            if (email.isEmpty()) {
                email = providerId + "@naver.com";
            }
            if (name.isEmpty()) {
                name = "네이버유저_" + (providerId.length() > 5 ? providerId.substring(0, 5) : providerId);
            }

            User user = userService.getOrCreateSocialUser("naver", providerId, email, name);
            String token = jwtTokenProvider.createToken(user.getEmail(), user.getRole());

            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "role", user.getRole(),
                    "name", user.getName(),
                    "email", user.getEmail(),
                    "phone", user.getPhone(),
                    "sns", user.getSns(),
                    "googleEmail", user.getGoogleEmail() == null ? "" : user.getGoogleEmail(),
                    "kakaoEmail", user.getKakaoEmail() == null ? "" : user.getKakaoEmail(),
                    "naverEmail", user.getNaverEmail() == null ? "" : user.getNaverEmail(),
                    "message", "네이버 소셜 로그인 연동이 정상 완료되었습니다."
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "네이버 소셜 로그인 연동 처리 중 서버 에러 발생: " + e.getMessage()));
        }
    }


    private String extractJsonValue(String json, String key) {
        if (json == null || key == null) return "";
        java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("\"" + key + "\"\\s*:\\s*\"?([^\",\\}]+)\"?");
        java.util.regex.Pattern numPattern = java.util.regex.Pattern.compile("\"" + key + "\"\\s*:\\s*([0-9]+)");
        
        java.util.regex.Matcher matcher = pattern.matcher(json);
        if (matcher.find()) {
            return matcher.group(1).trim().replace("\"", "");
        }
        
        java.util.regex.Matcher numMatcher = numPattern.matcher(json);
        if (numMatcher.find()) {
            return numMatcher.group(1).trim();
        }
        
        java.util.regex.Pattern objPattern = java.util.regex.Pattern.compile("\"" + key + "\"\\s*:\\s*(\\{[^\\}]+\\})");
        java.util.regex.Matcher objMatcher = objPattern.matcher(json);
        if (objMatcher.find()) {
            return objMatcher.group(1);
        }
        
        return "";
    }
}
