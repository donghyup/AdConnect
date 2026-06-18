package com.adconnect.backend.controller;

import com.adconnect.backend.entity.Report;
import com.adconnect.backend.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping
    public ResponseEntity<List<Report>> getAll() {
        return ResponseEntity.ok(reportService.getAll());
    }

    @PostMapping
    public ResponseEntity<Report> create(@RequestBody Map<String, String> body) {
        Report saved = reportService.create(body.get("type"), body.get("target"), body.get("reporter"));
        return ResponseEntity.ok(saved);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(reportService.updateStatus(id, body.get("status")));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        reportService.delete(id);
        return ResponseEntity.ok(Map.of("message", "신고가 기각 처리되었습니다."));
    }
}
