import React from 'react';
import {
  Megaphone,
  LayoutDashboard,
  Award,
  MessageSquare,
  FileSignature,
  ShieldAlert,
  Smartphone,
  User,
  LogOut
} from 'lucide-react';

export default function Sidebar({
  mobileMenuOpen,
  currentView,
  setCurrentView,
  setMobileMenuOpen,
  setShowNotificationPanel,
  userRole,
  isGuestMode,
  setIsGuestMode,
  setIsLoggedIn,
  setAuthStep,
  userName,
  handleLogout
}) {
  const navigateTo = (view) => {
    setCurrentView(view);
    setShowNotificationPanel(false);
    setMobileMenuOpen(false);
  };

  return (
    <aside className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Megaphone size={18} />
        </div>
        <h1>Ad-Connect</h1>
      </div>

      <div className="sidebar-menu">
        <div 
          className={`menu-item ${currentView === 'dashboard' ? 'active' : ''}`}
          onClick={() => navigateTo('dashboard')}
        >
          <LayoutDashboard size={18} />
          대시보드 성과 분석
        </div>

        <div 
          className={`menu-item ${currentView === 'marketplace' ? 'active' : ''}`}
          onClick={() => navigateTo('marketplace')}
        >
          <Megaphone size={18} />
          광고 매칭 보드
        </div>

        {userRole === 'creator' && (
          <div 
            className={`menu-item ${currentView === 'portfolio' ? 'active' : ''}`}
            onClick={() => navigateTo('portfolio')}
          >
            <Award size={18} />
            유튜브 포트폴리오
          </div>
        )}

        <div 
          className={`menu-item ${currentView === 'chat' ? 'active' : ''}`}
          onClick={() => navigateTo('chat')}
        >
          <MessageSquare size={18} />
          실시간 채팅방
        </div>

        <div 
          className={`menu-item ${currentView === 'contracts' ? 'active' : ''}`}
          onClick={() => navigateTo('contracts')}
        >
          <FileSignature size={18} />
          계약 및 정산 관리
        </div>

        {userRole === 'admin' && (
          <div 
            className={`menu-item ${currentView === 'admin' ? 'active' : ''}`}
            onClick={() => navigateTo('admin')}
          >
            <ShieldAlert size={18} />
            운영 어드민 센터
          </div>
        )}

        <div style={{ display: 'none' }}
          className={`menu-item ${currentView === 'appDownload' ? 'active' : ''}`}
          onClick={() => navigateTo('appDownload')}
        >
          <Smartphone size={18} />
          하이브리드 앱 다운로드
        </div>

        <div 
          className={`menu-item ${currentView === 'mypage' ? 'active' : ''}`}
          onClick={() => navigateTo('mypage')}
        >
          <User size={18} />
          마이페이지
        </div>

        <div 
          className="menu-item"
          onClick={handleLogout}
          style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '16px', color: 'var(--accent)' }}
        >
          <LogOut size={18} />
          로그아웃
        </div>
      </div>

      <div className="sidebar-footer">
        {isGuestMode ? (
          <div className="user-card guest-card" style={{ border: '1px dashed var(--primary)', cursor: 'default' }} title="게스트 모드">
            <div className="logo-icon" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
              <User size={18} />
            </div>
            <div className="user-info" style={{ flex: 1 }}>
              <div className="user-name" style={{ fontSize: '13px', fontWeight: '600' }}>게스트 둘러보기</div>
              <div className="user-role" style={{ textTransform: 'uppercase', fontSize: '10px', color: 'var(--primary)' }}>
                {userRole} 모드
              </div>
            </div>
            <button 
              className="btn btn-primary" 
              style={{ padding: '6px 10px', fontSize: '11px', whiteSpace: 'nowrap' }}
              onClick={() => {
                setIsGuestMode(false);
                setIsLoggedIn(false);
                setAuthStep('landing');
              }}
            >
              로그인
            </button>
          </div>
        ) : (
          <div className="user-card" onClick={() => navigateTo('mypage')} title="마이페이지 이동">
            <img 
              src={
                userRole === 'creator' 
                  ? "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80"
                  : userRole === 'advertiser'
                    ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    : "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80"
              } 
              alt="avatar" 
              className="user-avatar" 
            />
            <div className="user-info">
              <div className="user-name">{userName}</div>
              <div className="user-role" style={{ textTransform: 'uppercase', fontSize: '10px', color: 'var(--primary)' }}>
                {userRole}
              </div>
            </div>
            <div onClick={(e) => { e.stopPropagation(); handleLogout(); }} title="로그아웃">
              <LogOut size={16} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
