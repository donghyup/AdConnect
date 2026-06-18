package com.adconnect.backend.service;

import com.adconnect.backend.entity.Report;
import com.adconnect.backend.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ReportService {

    private final ReportRepository reportRepository;

    @Transactional(readOnly = true)
    public List<Report> getAll() {
        return reportRepository.findAllByOrderByIdDesc();
    }

    public Report create(String type, String target, String reporter) {
        Report report = Report.builder()
                .type(type == null ? "유저 신고" : type)
                .target(target)
                .reporter(reporter == null ? "관리자 검수" : reporter)
                .status("대기 중")
                .date(LocalDate.now().toString())
                .build();
        return reportRepository.save(report);
    }

    public Report updateStatus(Long id, String status) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("신고 내역을 찾을 수 없습니다."));
        report.setStatus(status);
        return reportRepository.save(report);
    }

    public void delete(Long id) {
        reportRepository.deleteById(id);
    }
}
