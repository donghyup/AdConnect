import React from 'react';
import { useLocation } from 'react-router-dom';
import { SlidersHorizontal, Sun, Moon, Bell } from 'lucide-react';

export default function TopHeader({
  mobileMenuOpen,
  setMobileMenuOpen,
  wsStatus,
  theme,
  setTheme,
  showNotificationPanel,
  setShowNotificationPanel,
  notifications,
  setNotifications,
  handleNotificationClick,
  addToast
}) {
  const location = useLocation();
  const currentView = location.pathname.substring(1) || 'dashboard';
  return (
    <div className="top-header">
      <div className="header-left-group" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button 
          className="mobile-toggle-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          title="메뉴 열기"
        >
          <SlidersHorizontal size={18} />
        </button>
        <div className="page-title">
          <h2>
            {currentView === 'dashboard' && '광고주 & 크리에이터 성과 분석'}
            {currentView === 'marketplace' && '광고 매칭 스페이스'}
            {currentView === 'portfolio' && '유튜브 API 포트폴리오 연동'}
            {currentView === 'chat' && '협업 실시간 STOMP 메신저'}
            {currentView === 'contracts' && '전자 계약 및 PortOne 결제 안전지대'}
            {currentView === 'admin' && '부적절 광고 검수 및 스팸 신고 관리'}
            {currentView === 'mypage' && '회원정보 관리 및 설정'}
          </h2>
          <p>실제 프로덕션 수준의 SaaS 아키텍처 및 무결성 제어</p>
        </div>
      </div>

      <div className="header-actions">
        {/* Mock connection state indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', background: 'rgba(255,255,255,0.02)', padding: '6px 12px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
          <span className="active-dot" style={{ position: 'relative', display: 'inline-block', width: '8px', height: '8px' }}></span>
          <span style={{ color: 'var(--text-secondary)' }}>WS:</span>
          <span style={{ fontWeight: 'bold', color: 'var(--secondary)' }}>{wsStatus}</span>
        </div>

        {/* Theme toggle */}
        <button className="btn-icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications bell */}
        <div className="notification-bell-container">
          <button className="btn-icon" onClick={() => setShowNotificationPanel(!showNotificationPanel)}>
            <Bell size={18} />
            {notifications.filter(n => n.unread).length > 0 && (
              <span className="notification-count">
                {notifications.filter(n => n.unread).length}
              </span>
            )}
          </button>

          {showNotificationPanel && (
            <div className="notification-panel">
              <div className="notification-panel-header">
                <span>실시간 통합 알림</span>
                <button 
                  className="btn" 
                  style={{ padding: '2px 8px', fontSize: '11px' }} 
                  onClick={() => {
                    setNotifications(notifications.map(n => ({ ...n, unread: false })));
                    addToast("모든 알림을 읽음 처리했습니다.", "success");
                  }}
                >
                  모두 읽음
                </button>
              </div>
              <div className="notifications-list">
                {notifications.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    새로운 알림이 없습니다.
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div 
                      key={notif.id} 
                      className={`notification-item ${notif.unread ? 'unread' : ''}`}
                      onClick={() => handleNotificationClick(notif)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="notification-icon-wrapper" style={{ 
                        background: notif.type === 'match' ? 'rgba(16, 185, 129, 0.1)' : notif.type === 'contract' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        color: notif.type === 'match' ? 'var(--secondary)' : notif.type === 'contract' ? 'var(--primary)' : 'var(--warning)'
                      }}>
                        <Bell size={16} />
                      </div>
                      <div className="notification-content">
                        <p className="notification-text">{notif.text}</p>
                        <span className="notification-time">{notif.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
