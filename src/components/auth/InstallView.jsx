import React from 'react';
import { Smartphone, Download, Play, AlertTriangle } from 'lucide-react';

export default function InstallView({
  setIsInstallMode,
  addToast
}) {
  const origin = window.location.origin;

  return (
    <div className="auth-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '24px', width: '100%' }}>
      <div className="auth-card glass-card accent-indigo" style={{ maxWidth: '600px', width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="auth-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px' }}>
          <div className="logo-icon">
            <Smartphone size={20} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '8px 0 0 0' }}>Ad-Connect 안심 설치 안내 센터</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: 0 }}>모바일 앱의 안전한 다운로드와 설치 과정을 돕는 페이지입니다.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* Android Download Column */}
          <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Android APK
            </span>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', textAlign: 'center', margin: 0, minHeight: '32px' }}>안드로이드 스마트폰 전용 설치 파일</p>
            <a 
              href={origin + '/adconnect-release.apk'}
              download="adconnect-release.apk"
              className="btn btn-success"
              onClick={() => addToast("Android APK 다운로드가 시작되었습니다.", "success")}
              style={{ width: '100%', fontSize: '12px', padding: '10px' }}
            >
              <Download size={14} /> APK 다운로드
            </a>
          </div>

          {/* iOS Download Column */}
          <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#6366f1', display: 'flex', alignItems: 'center', gap: '6px' }}>
              iOS / iPhone
            </span>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', textAlign: 'center', margin: 0, minHeight: '32px' }}>아이폰 Safari 전용 무선 패키지 설치</p>
            <a 
              href={`itms-services://?action=download-manifest&url=${encodeURIComponent(origin + '/api/manifest')}`}
              className="btn btn-primary"
              onClick={() => addToast("iOS 무선 설치가 시작되었습니다.", "info")}
              style={{ width: '100%', fontSize: '12px', padding: '10px' }}
            >
              <Play size={14} /> 무선 설치 (OTA)
            </a>
          </div>
        </div>

        {/* Step by Step troubleshooting guide */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertTriangle size={16} /> 🚨 필독! 설치 차단/악성앱 경고 해결 방법
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '8px' }}>
              <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '2px' }}>1. 카카오톡/네이버 등의 인앱 브라우저 제한</strong>
              QR 스캔 후 이 화면이 카카오톡이나 네이버 내부 브라우저에서 열려 있으면 파일 다운로드가 차단될 수 있습니다. 
              우측 상단의 더보기(<span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>...</span>) 버튼을 눌러 <strong>[다른 브라우저로 열기]</strong> 또는 <strong>[Chrome으로 열기]</strong>를 선택해 주세요.
            </div>

            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '8px' }}>
              <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '2px' }}>2. "유해한 파일일 수 있음" 경고 무시</strong>
              구글 플레이스토어를 통하지 않은 모든 수동 설치 파일은 시스템이 경고를 띄웁니다. 본사 배포용 앱으로 안심하시고 <strong>[무시하고 다운로드]</strong> 또는 <strong>[그래도 다운로드]</strong>를 진행해 주세요.
            </div>

            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '8px' }}>
              <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '2px' }}>3. "Play 프로텍트에 의해 차단됨" 팝업 해결</strong>
              설치 시 구글 프로텍트 팝업이 뜨면 <strong>[확인]</strong> 대신 <strong>[세부정보 더보기]</strong>(또는 '자세히 보기') 화살표를 누르고, 아래에 작게 뜨는 <strong>[무시하고 설치]</strong>를 선택해 주세요.
            </div>

            <div>
              <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '2px' }}>4. 설치 버튼이 작동 안 하거나 도중에 꺼지는 경우</strong>
              모바일 금융 앱 백신(V3 Mobile Plus, 피싱아이즈 등)이 외부 APK의 설치 시도를 실시간으로 차단하여 튕기는 현상입니다. 백신 앱에서 실시간 탐지를 잠시 종료하거나 PC 원격제어 앱(TeamViewer 등)을 끄고 재시도해 주세요.
            </div>
          </div>
        </div>

        <button 
          className="btn btn-secondary"
          onClick={() => {
            setIsInstallMode(false);
            const url = new URL(window.location);
            url.searchParams.delete('mode');
            window.history.replaceState({}, document.title, url.pathname);
          }}
          style={{ width: '100%', fontSize: '13px' }}
        >
          Ad-Connect 웹 플랫폼 로그인으로 이동
        </button>
      </div>
    </div>
  );
}
