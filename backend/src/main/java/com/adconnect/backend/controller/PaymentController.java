package com.adconnect.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    // Default to Toss Payments official test secret key: test_sk_zXLkKEypN3WQk6Yn1278VJwZgB2d
    @Value("${tosspayments.secret-key:test_sk_zXLkKEypN3WQk6Yn1278VJwZgB2d}")
    private String secretKey;

    @PostMapping("/confirm")
    public ResponseEntity<?> confirmPayment(@RequestBody Map<String, String> request) {
        String paymentKey = request.get("paymentKey");
        String orderId = request.get("orderId");
        String amount = request.get("amount");

        if (paymentKey == null || orderId == null || amount == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "필수 파라미터(paymentKey, orderId, amount)가 누락되었습니다."));
        }

        try {
            HttpClient client = HttpClient.newHttpClient();
            
            // Authorization Header: Basic auth with "secretKey:" base64 encoded
            String authCredential = secretKey + ":";
            String base64Auth = Base64.getEncoder().encodeToString(authCredential.getBytes(StandardCharsets.UTF_8));
            
            String jsonBody = "{"
                    + "\"paymentKey\":\"" + paymentKey + "\","
                    + "\"orderId\":\"" + orderId + "\","
                    + "\"amount\":" + amount
                    + "}";

            HttpRequest apiRequest = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.tosspayments.com/v1/payments/confirm"))
                    .header("Authorization", "Basic " + base64Auth)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody, StandardCharsets.UTF_8))
                    .build();

            HttpResponse<String> apiResponse = client.send(apiRequest, HttpResponse.BodyHandlers.ofString());

            if (apiResponse.statusCode() >= 300) {
                return ResponseEntity.status(apiResponse.statusCode())
                        .body(Map.of("message", "토스페이먼츠 승인 요청 거절: " + apiResponse.body()));
            }

            return ResponseEntity.ok(Map.of(
                    "status", "SUCCESS",
                    "message", "결제 승인이 완료되었습니다.",
                    "details", apiResponse.body()
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "결제 승인 처리 중 내부 서버 에러 발생: " + e.getMessage()));
        }
    }
}
