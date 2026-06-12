import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sun,
  Moon,
  ShieldCheck,
  ExternalLink,
  TrendingUp,
  CheckCircle2,
  Users,
  DollarSign,
  LayoutDashboard,
  FileSignature,
  MessageSquare
} from 'lucide-react';

export default function LandingView({
  theme,
  setTheme,
  setIsGuestMode,
  addToast
}) {
  const navigate = useNavigate();
  return (
    <div className="landing-container" style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      position: 'relative',
      background: 'var(--bg-app)',
      overflow: 'hidden'
    }}>
      {/* Floating Theme Toggle on Landing Screen */}
      <div style={{ position: 'absolute', top: '24px', right: '24px', zIndex: 100 }}>
        <button 
          type="button"
          className="btn-icon" 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          style={{ width: '44px', height: '44px', borderRadius: '50%', boxShadow: 'var(--shadow-glow)', cursor: 'pointer', background: 'var(--glass-bg)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
        >
          {theme === 'dark' ? <Sun size={20} color="var(--primary)" /> : <Moon size={20} color="var(--primary)" />}
        </button>
      </div>

      {/* Decorative Background Glows */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-10%',
        width: '40vw',
        height: '40vw',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0) 70%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '-10%',
        width: '40vw',
        height: '40vw',
        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, rgba(168, 85, 247, 0) 70%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* Main Content Area */}
      <div className="landing-content" style={{ maxWidth: '1200px', width: '100%', zIndex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '48px', alignItems: 'center' }}>
        
        {/* Hero Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', maxWidth: '800px' }}>
          <div className="logo-icon" style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: 'var(--shadow-glow)', marginBottom: '8px' }}>
            <ShieldCheck size={32} />
          </div>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: '900',
            lineHeight: '1.15',
            letterSpacing: '-0.03em',
            margin: 0,
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textTransform: 'uppercase'
          }}>
            AD-CONNECT
          </h1>
          <p style={{
            fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
            fontWeight: '500',
            color: 'var(--text-primary)',
            margin: '8px 0 0 0',
            lineHeight: '1.4'
          }}>
            데이터 기반 크리에이터 & 광고주 매칭 플랫폼
          </p>
          <p style={{
            fontSize: '15px',
            color: 'var(--text-secondary)',
            maxWidth: '600px',
            margin: '12px 0 0 0',
            lineHeight: '1.6'
          }}>
            인플루언서 채널의 실시간 조회수, 구독자, 도달률 통계를 바탕으로 매칭부터 안전 에스크로 결제 및 전자 계약까지 원스톱으로 제공합니다.
          </p>

          {/* Actions CTA */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '32px', width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/login')}
              style={{ padding: '16px 32px', fontSize: '16px', fontWeight: 'bold', minWidth: '220px', borderRadius: '12px', boxShadow: 'var(--shadow-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
            >
              로그인 / 회원가입 시작하기
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => {
                setIsGuestMode(true);
                addToast("둘러보기 게스트 모드로 입장했습니다. (읽기 전용)", "info");
              }}
              style={{ padding: '16px 32px', fontSize: '16px', fontWeight: 'bold', minWidth: '220px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
            >
              게스트로 플랫폼 둘러보기 <ExternalLink size={16} />
            </button>
          </div>
        </div>

        {/* Stats Dashboard Snippet */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px',
          width: '100%',
          maxWidth: '1000px',
          marginTop: '16px'
        }}>
          {[
            { label: '누적 매칭 성사', value: '12,450건+', icon: <TrendingUp size={20} color="var(--primary)" /> },
            { label: '매칭 성공률', value: '97.4%', icon: <CheckCircle2 size={20} color="var(--secondary)" /> },
            { label: '활성 크리에이터', value: '15,000명+', icon: <Users size={20} color="var(--accent)" /> },
            { label: '평균 캠페인 ROI', value: '184%', icon: <DollarSign size={20} color="#eab308" /> }
          ].map((stat, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', borderRadius: '16px', background: 'var(--glass-bg)', border: '1px solid var(--border-color)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {stat.icon}
              </div>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500' }}>{stat.label}</span>
              <strong style={{ fontSize: '24px', color: 'var(--text-primary)', fontWeight: '800' }}>{stat.value}</strong>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-primary)', textAlign: 'left', borderLeft: '4px solid var(--primary)', paddingLeft: '12px', margin: 0 }}>
            핵심 비즈니스 기능
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px'
          }}>
            {[
              { title: '실시간 데이터 매칭', desc: '채널의 통계 분석 및 Recharts 데이터 분석 차트를 통해 성과 지표를 실시간 시각화합니다.', icon: <LayoutDashboard size={20} /> },
              { title: '안전 에스크로 결제', desc: '토스페이먼츠(Toss Payments) 게이트웨이 시뮬레이터를 이용한 안전한 예치 대금 거래를 보장합니다.', icon: <ShieldCheck size={20} /> },
              { title: '전자 계약 및 서명', desc: '캔버스를 활용한 온라인 전자 서명 작성 및 보안화(SHA-256)된 계약서 PDF 다운로드를 지원합니다.', icon: <FileSignature size={20} /> },
              { title: '지능형 매칭 대화방', desc: '광고주와 인플루언서 간의 1:1 전용 실시간 조율 채팅 및 양방향 협상 룸을 제공합니다.', icon: <MessageSquare size={20} /> }
            ].map((feat, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', borderRadius: '16px', background: 'var(--glass-bg)', border: '1px solid var(--border-color)', textAlign: 'left', transition: 'transform 0.2s ease', cursor: 'default' }}
                   onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                   onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ color: 'var(--primary)', width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {feat.icon}
                </div>
                <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>{feat.title}</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid var(--border-color)', width: '100%', maxWidth: '1000px', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>&copy; 2026 Ad-Connect Inc. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => addToast("이용약관 안내 준비 중입니다.", "info")}>이용약관</span>
            <span style={{ cursor: 'pointer' }} onClick={() => addToast("개인정보처리방침 안내 준비 중입니다.", "info")}>개인정보처리방침</span>
            <span style={{ cursor: 'pointer' }} onClick={() => addToast("고객센터 연락처: support@ad-connect.com", "info")}>고객지원</span>
          </div>
        </div>

      </div>
    </div>
  );
}
