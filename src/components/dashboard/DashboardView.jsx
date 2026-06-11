import React from 'react';
import { Eye, TrendingUp, DollarSign, Users } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export default function DashboardView({
  ads,
  analyticsTrend,
  analyticsRoi
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div className="kpi-grid">
        <div className="glass-card kpi-card accent-indigo">
          <div className="kpi-content">
            <span className="kpi-label">누적 도달 조회수</span>
            <span className="kpi-value">185,000회</span>
            <span className="kpi-change up">▲ 24.3% 이번달</span>
          </div>
          <div className="kpi-icon indigo">
            <Eye size={24} />
          </div>
        </div>

        <div className="glass-card kpi-card accent-emerald">
          <div className="kpi-content">
            <span className="kpi-label">평균 매칭 클릭률 (CTR)</span>
            <span className="kpi-value">5.20%</span>
            <span className="kpi-change up">▲ 1.1% 지난주 대비</span>
          </div>
          <div className="kpi-icon emerald">
            <TrendingUp size={24} />
          </div>
        </div>

        <div className="glass-card kpi-card accent-rose">
          <div className="kpi-content">
            <span className="kpi-label">총 광고 예산 매출</span>
            <span className="kpi-value">₩11.3M</span>
            <span className="kpi-change up">▲ ₩3.2M 증가</span>
          </div>
          <div className="kpi-icon rose">
            <DollarSign size={24} />
          </div>
        </div>

        <div className="glass-card kpi-card accent-rose" style={{ borderLeft: '4px solid var(--warning)' }}>
          <div className="kpi-content">
            <span className="kpi-label">크리에이터 파트너</span>
            <span className="kpi-value">124.5K</span>
            <span className="kpi-change up">▲ 4,200명 증감</span>
          </div>
          <div className="kpi-icon indigo">
            <Users size={24} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '32px' }}>
        <div className="glass-card" style={{ minWidth: 0 }}>
          <h3 style={{ marginBottom: '20px' }}>캠페인 실시간 성과 추이 (조회수 및 CTR 상관관계)</h3>
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <LineChart data={analyticsTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis yAxisId="left" stroke="var(--primary)" />
                <YAxis yAxisId="right" orientation="right" stroke="var(--secondary)" />
                <Tooltip contentStyle={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="조회수" stroke="var(--primary)" strokeWidth={3} activeDot={{ r: 8 }} />
                <Line yAxisId="right" type="monotone" dataKey="CTR" stroke="var(--secondary)" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card" style={{ minWidth: 0 }}>
          <h3 style={{ marginBottom: '20px' }}>광고주별 예산 대비 광고 매출 성과 (ROI / Return On Investment)</h3>
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <BarChart data={analyticsRoi} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip contentStyle={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }} />
                <Legend />
                <Bar dataKey="예산" fill="rgba(99, 102, 241, 0.7)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="매출" fill="rgba(16, 185, 129, 0.7)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass-card">
        <h3 style={{ marginBottom: '16px' }}>크리에이터 캠페인 참여도 분석</h3>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>캠페인 정보</th>
                <th>평균 조회수</th>
                <th>좋아요 참여율</th>
                <th>댓글 반응도</th>
                <th>추정 전환율(CVR)</th>
              </tr>
            </thead>
            <tbody>
              {ads.filter(a => a.status === '승인 완료').map(ad => (
                <tr key={ad.id}>
                  <td style={{ fontWeight: 'bold' }}>{ad.title}</td>
                  <td>{ad.views.toLocaleString()}회</td>
                  <td>{ad.views > 0 ? ((ad.likes / ad.views) * 100).toFixed(2) : '0.00'}%</td>
                  <td>{ad.views > 0 ? ((ad.comments / ad.views) * 100).toFixed(2) : '0.00'}%</td>
                  <td><span className="badge badge-emerald">{(ad.id * 1.3).toFixed(1)}%</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
