import React, { useState } from 'react';
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
  MessageSquare,
  X
} from 'lucide-react';

export default function LandingView({
  theme,
  setTheme,
  setIsGuestMode,
  addToast
}) {
  const navigate = useNavigate();
  const [showPrivacy, setShowPrivacy] = useState(false);
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
            <span style={{ cursor: 'pointer' }} onClick={() => setShowPrivacy(true)}>개인정보처리방침</span>
            <span style={{ cursor: 'pointer' }} onClick={() => addToast("고객지원 전화: 051-123-4567", "info")}>고객지원</span>
          </div>
        </div>

      </div>

      {/* 개인정보처리방침 모달 */}
      {showPrivacy && (
        <div
          onClick={() => setShowPrivacy(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}
        >
          <div
            className="glass-card"
            onClick={(e) => e.stopPropagation()}
            style={{ width: '100%', maxWidth: '720px', maxHeight: '85vh', overflowY: 'auto', textAlign: 'left' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h2 style={{ fontSize: '20px' }}>개인정보처리방침</h2>
              <button onClick={() => setShowPrivacy(false)} style={{ background: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <X size={22} />
              </button>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>
              주식회사 Ad-Connect(이하 "회사")는 「개인정보 보호법」 등 관련 법령을 준수하며, 이용자의 개인정보를 다음과 같이 처리합니다. (시행일: 2026년 1월 1일)
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', fontSize: '13px', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
              <section>
                <h4 style={{ color: 'white', marginBottom: '6px' }}>제1조 (개인정보의 처리 목적)</h4>
                회사는 다음의 목적을 위하여 개인정보를 처리하며, 목적 외의 용도로는 이용하지 않습니다.
                <ul style={{ margin: '6px 0 0 18px' }}>
                  <li>회원 가입 의사 확인, 본인 식별·인증, 회원자격 유지·관리</li>
                  <li>광고주–크리에이터 매칭 서비스 제공, 계약 체결 및 에스크로 정산</li>
                  <li>고객 문의 응대, 분쟁 처리 및 공지사항 전달</li>
                  <li>이용자 동의 시 신규 서비스 안내 및 마케팅·이벤트 정보 제공</li>
                </ul>
              </section>

              <section>
                <h4 style={{ color: 'white', marginBottom: '6px' }}>제2조 (개인정보의 처리 및 보유 기간)</h4>
                회사는 법령에 따른 보유·이용 기간 또는 이용자로부터 동의받은 기간 내에서 개인정보를 처리·보유합니다.
                <ul style={{ margin: '6px 0 0 18px' }}>
                  <li>회원 정보: 회원 탈퇴 시까지 (관련 분쟁 발생 시 종료 시까지)</li>
                  <li>계약·결제·정산 기록: 「전자상거래법」에 따라 5년</li>
                  <li>소비자 불만 또는 분쟁 처리 기록: 3년</li>
                  <li>접속 로그 기록: 「통신비밀보호법」에 따라 3개월</li>
                </ul>
              </section>

              <section>
                <h4 style={{ color: 'white', marginBottom: '6px' }}>제3조 (개인정보의 제3자 제공)</h4>
                회사는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 다만 매칭 성사 시 계약 이행에 필요한 범위에서 상대 당사자에게 닉네임·채널 정보 등 최소한의 정보가 제공되며, 법령에 근거가 있거나 이용자의 별도 동의가 있는 경우에 한해 제공합니다.
              </section>

              <section>
                <h4 style={{ color: 'white', marginBottom: '6px' }}>제4조 (개인정보 처리의 위탁)</h4>
                회사는 원활한 서비스 운영을 위해 다음과 같이 업무를 위탁하고 있으며, 수탁자가 관련 법령을 준수하도록 관리·감독합니다.
                <ul style={{ margin: '6px 0 0 18px' }}>
                  <li>토스페이먼츠(PortOne): 결제 및 에스크로 정산 처리</li>
                  <li>Amazon Web Services / Render: 서버 인프라 운영 및 데이터 보관</li>
                  <li>EmailJS: 인증번호(OTP) 및 알림 메일 발송</li>
                </ul>
              </section>

              <section>
                <h4 style={{ color: 'white', marginBottom: '6px' }}>제5조 (개인정보의 파기 절차 및 방법)</h4>
                보유 기간이 경과하거나 처리 목적이 달성된 개인정보는 지체 없이 파기합니다. 전자적 파일은 복구가 불가능한 방법으로 영구 삭제하며, 종이 문서는 분쇄하거나 소각하여 파기합니다.
              </section>

              <section>
                <h4 style={{ color: 'white', marginBottom: '6px' }}>제6조 (이용자의 권리와 행사 방법)</h4>
                이용자는 언제든지 본인의 개인정보에 대한 열람·정정·삭제·처리정지를 요구할 수 있습니다. 마이페이지에서 직접 처리하거나 개인정보 보호책임자에게 서면·전화·이메일로 요청할 수 있으며, 회사는 지체 없이 조치합니다.
              </section>

              <section>
                <h4 style={{ color: 'white', marginBottom: '6px' }}>제7조 (개인정보 보호책임자)</h4>
                회사는 개인정보 처리에 관한 업무를 총괄하고 이용자의 민원을 처리하기 위해 아래와 같이 보호책임자를 지정하고 있습니다.
                <ul style={{ margin: '6px 0 0 18px' }}>
                  <li>개인정보 보호책임자: 김보안 (CISO)</li>
                  <li>연락처: 051-123-4567 / privacy@ad-connect.com</li>
                </ul>
              </section>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary" onClick={() => setShowPrivacy(false)}>확인</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
