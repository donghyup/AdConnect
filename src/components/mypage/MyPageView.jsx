import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, RefreshCw, AlertTriangle } from 'lucide-react';

export default function MyPageView({
  userRole,
  userName,
  setUserName,
  userEmail,
  setUserEmail,
  userPhone,
  setUserPhone,
  userSns,
  setUserSns,
  googleEmail,
  setGoogleEmail,
  kakaoEmail,
  setKakaoEmail,
  naverEmail,
  setNaverEmail,
  profileForm,
  setProfileForm,
  passwordForm,
  setPasswordForm,
  isWithdrawModalOpen,
  setIsWithdrawModalOpen,
  withdrawConfirmName,
  setWithdrawConfirmName,
  isGuestMode,
  isBackendConnected,
  API_BASE_URL,
  token,
  setToken,
  setAuthInput,
  setOtpCode,
  setIsLoggedIn,
  addToast
}) {
  const navigate = useNavigate();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div className="glass-card">
        <div className="portfolio-header">
          <img 
            src={
              userRole === 'creator' 
                ? "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80"
                : userRole === 'advertiser'
                  ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                  : "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80"
            }
            alt="avatar" 
            className="portfolio-avatar" 
          />
          <div className="portfolio-profile">
            <span className="badge badge-indigo" style={{ textTransform: 'uppercase' }}>{userRole} 계정정보</span>
            <h3 className="portfolio-name">{userName}</h3>
            <p style={{ color: 'var(--text-secondary)' }}>이메일: {userEmail} | 연락처: {userPhone}</p>
          </div>
        </div>
      </div>

      <div className="mypage-grid">
        {/* Left Column: Profile edit & Password edit */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* 1. 개인정보 변경 */}
          <div className="glass-card accent-indigo">
            <h3 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={20} color="var(--primary)" />
              개인정보 변경
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
              플랫폼에서 사용되는 회원님의 프로필 이름 및 연락정보를 실시간으로 변경합니다.
            </p>

            <form 
              className="contract-form"
              onSubmit={async (e) => {
                e.preventDefault();
                if (isGuestMode) {
                  addToast("둘러보기 모드에서는 읽기 전용입니다. 이 기능을 사용하려면 로그인해 주세요.", "warning");
                  return;
                }
                if (isBackendConnected) {
                  try {
                    const response = await fetch(`${API_BASE_URL}/users/profile`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                      },
                      body: JSON.stringify({
                        email: userEmail,
                        name: profileForm.name,
                        phone: profileForm.phone,
                        sns: profileForm.sns
                      })
                    });
                    const data = await response.json();
                    if (response.ok) {
                      setUserName(data.name);
                      setUserPhone(data.phone);
                      setUserSns(data.sns);
                      addToast(data.message || "개인정보가 성공적으로 변경되었습니다.", "success");
                    } else {
                      addToast(data.message || "개인정보 변경 실패", "error");
                    }
                  } catch (err) {
                    addToast("백엔드 통신 오류", "error");
                  }
                } else {
                  setUserName(profileForm.name);
                  setUserEmail(profileForm.email);
                  setUserPhone(profileForm.phone);
                  setUserSns(profileForm.sns);
                  addToast("개인정보가 정상적으로 반영되었습니다. [모의 모드]", "success");
                }
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>사용자 이름 / 기업명</label>
                  <input 
                    type="text" 
                    className="input-control"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>대표 이메일 주소</label>
                  <input 
                    type="email" 
                    className="input-control"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    required 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>대표 연락처</label>
                  <input 
                    type="text" 
                    className="input-control"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>SNS/웹 URL</label>
                  <input 
                    type="text" 
                    className="input-control"
                    value={profileForm.sns}
                    onChange={(e) => setProfileForm({ ...profileForm, sns: e.target.value })}
                    required 
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
                개인정보 저장하기
              </button>
            </form>
          </div>

          {/* 2. 비밀번호 변경 */}
          <div className="glass-card">
            <h3 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={20} color="var(--warning)" />
              비밀번호 변경
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
              계정 로그인을 위한 새로운 보안 비밀번호를 암호화하여 재설정합니다.
            </p>

            <form 
              className="contract-form"
              onSubmit={async (e) => {
                e.preventDefault();
                if (isGuestMode) {
                  addToast("둘러보기 모드에서는 읽기 전용입니다. 이 기능을 사용하려면 로그인해 주세요.", "warning");
                  return;
                }
                if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
                  addToast("모든 비밀번호 필드를 채워주세요.", "warning");
                  return;
                }
                if (passwordForm.new !== passwordForm.confirm) {
                  addToast("새 비밀번호와 확인 입력이 일치하지 않습니다.", "error");
                  return;
                }

                if (isBackendConnected) {
                  try {
                    const response = await fetch(`${API_BASE_URL}/users/password`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                      },
                      body: JSON.stringify({
                        email: userEmail,
                        current: passwordForm.current,
                        new: passwordForm.new
                      })
                    });
                    const data = await response.json();
                    if (response.ok) {
                      addToast(data.message || "비밀번호가 안전하게 변경되었습니다.", "success");
                      setPasswordForm({ current: '', new: '', confirm: '' });
                    } else {
                      addToast(data.message || "비밀번호 변경 실패", "error");
                    }
                  } catch (err) {
                    addToast("백엔드 통신 오류", "error");
                  }
                } else {
                  addToast("비밀번호가 보안 알고리즘(SHA-256)을 거쳐 안전하게 업데이트되었습니다. [모의 모드]", "success");
                  setPasswordForm({ current: '', new: '', confirm: '' });
                }
              }}
            >
              <div className="form-group">
                <label>현재 비밀번호</label>
                <input 
                  type="password" 
                  className="input-control" 
                  placeholder="현재 비밀번호를 입력하세요"
                  value={passwordForm.current}
                  onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                  required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>새 비밀번호</label>
                  <input 
                    type="password" 
                    className="input-control" 
                    placeholder="새 비밀번호"
                    value={passwordForm.new}
                    onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>새 비밀번호 확인</label>
                  <input 
                    type="password" 
                    className="input-control" 
                    placeholder="새 비밀번호 확인"
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-secondary" style={{ width: '100%', marginTop: '8px' }}>
                비밀번호 변경 완료
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Danger Zone & Social Linking */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* 소셜 계정 연동 관리 */}
          <div className="glass-card">
            <h3 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RefreshCw size={20} color="var(--primary)" />
              소셜 계정 연동 관리
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
              구글, 카카오, 네이버 이메일을 연동하여 1초 간편 로그인 및 중요 계약 알림을 수신할 수 있습니다.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Google Row */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', background: 'rgba(219, 68, 85, 0.1)', color: '#ea4335', padding: '4px 8px', borderRadius: '4px' }}>Google</span>
                    {googleEmail ? (
                      <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{googleEmail}</span>
                    ) : (
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>연동되지 않음</span>
                    )}
                  </div>
                  {googleEmail && (
                    <button 
                      className="btn btn-secondary" 
                      style={{ padding: '4px 10px', fontSize: '11px', background: 'rgba(255,255,255,0.02)' }}
                      onClick={() => {
                        if (isGuestMode) {
                          addToast("둘러보기 모드에서는 읽기 전용입니다. 이 기능을 사용하려면 로그인해 주세요.", "warning");
                          return;
                        }
                        setGoogleEmail('');
                        addToast("Google 계정 연동이 해제되었습니다.", "info");
                      }}
                    >
                      연동 해제
                    </button>
                  )}
                </div>
                {!googleEmail && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <input 
                      type="email" 
                      id="google-link-email"
                      placeholder="연동할 Google 이메일 입력" 
                      className="input-control" 
                      style={{ padding: '6px 12px', fontSize: '12px', flex: 1, minHeight: 'auto' }}
                    />
                    <button 
                      className="btn btn-primary" 
                      style={{ padding: '6px 12px', fontSize: '12px', whiteSpace: 'nowrap' }}
                      onClick={() => {
                        if (isGuestMode) {
                          addToast("둘러보기 모드에서는 읽기 전용입니다. 이 기능을 사용하려면 로그인해 주세요.", "warning");
                          return;
                        }
                        const val = document.getElementById('google-link-email').value;
                        if (!val || !val.includes('@')) {
                          addToast("올바른 이메일 주소를 입력해주세요.", "error");
                          return;
                        }
                        setGoogleEmail(val);
                        addToast(`Google 계정이 연동 완료되었습니다. (${val})`, "success");
                      }}
                    >
                      연동하기
                    </button>
                  </div>
                )}
              </div>

              {/* Kakao Row */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', background: 'rgba(250, 225, 0, 0.1)', color: '#fee500', padding: '4px 8px', borderRadius: '4px' }}>Kakao</span>
                    {kakaoEmail ? (
                      <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{kakaoEmail}</span>
                    ) : (
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>연동되지 않음</span>
                    )}
                  </div>
                  {kakaoEmail && (
                    <button 
                      className="btn btn-secondary" 
                      style={{ padding: '4px 10px', fontSize: '11px', background: 'rgba(255,255,255,0.02)' }}
                      onClick={() => {
                        if (isGuestMode) {
                          addToast("둘러보기 모드에서는 읽기 전용입니다. 이 기능을 사용하려면 로그인해 주세요.", "warning");
                          return;
                        }
                        setKakaoEmail('');
                        addToast("Kakao 계정 연동이 해제되었습니다.", "info");
                      }}
                    >
                      연동 해제
                    </button>
                  )}
                </div>
                {!kakaoEmail && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <input 
                      type="email" 
                      id="kakao-link-email"
                      placeholder="연동할 Kakao 이메일 입력" 
                      className="input-control" 
                      style={{ padding: '6px 12px', fontSize: '12px', flex: 1, minHeight: 'auto' }}
                    />
                    <button 
                      className="btn btn-primary" 
                      style={{ padding: '6px 12px', fontSize: '12px', whiteSpace: 'nowrap' }}
                      onClick={() => {
                        if (isGuestMode) {
                          addToast("둘러보기 모드에서는 읽기 전용입니다. 이 기능을 사용하려면 로그인해 주세요.", "warning");
                          return;
                        }
                        const val = document.getElementById('kakao-link-email').value;
                        if (!val || !val.includes('@')) {
                          addToast("올바른 이메일 주소를 입력해주세요.", "error");
                          return;
                        }
                        setKakaoEmail(val);
                        addToast(`Kakao 계정이 연동 완료되었습니다. (${val})`, "success");
                      }}
                    >
                      연동하기
                    </button>
                  </div>
                )}
              </div>

              {/* Naver Row */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', background: 'rgba(3, 199, 90, 0.1)', color: '#03c75a', padding: '4px 8px', borderRadius: '4px' }}>Naver</span>
                    {naverEmail ? (
                      <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{naverEmail}</span>
                    ) : (
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>연동되지 않음</span>
                    )}
                  </div>
                  {naverEmail && (
                    <button 
                      className="btn btn-secondary" 
                      style={{ padding: '4px 10px', fontSize: '11px', background: 'rgba(255,255,255,0.02)' }}
                      onClick={() => {
                        if (isGuestMode) {
                          addToast("둘러보기 모드에서는 읽기 전용입니다. 이 기능을 사용하려면 로그인해 주세요.", "warning");
                          return;
                        }
                        setNaverEmail('');
                        addToast("Naver 계정 연동이 해제되었습니다.", "info");
                      }}
                    >
                      연동 해제
                    </button>
                  )}
                </div>
                {!naverEmail && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <input 
                      type="email" 
                      id="naver-link-email"
                      placeholder="연동할 Naver 이메일 입력" 
                      className="input-control" 
                      style={{ padding: '6px 12px', fontSize: '12px', flex: 1, minHeight: 'auto' }}
                    />
                    <button 
                      className="btn btn-primary" 
                      style={{ padding: '6px 12px', fontSize: '12px', whiteSpace: 'nowrap' }}
                      onClick={() => {
                        if (isGuestMode) {
                          addToast("둘러보기 모드에서는 읽기 전용입니다. 이 기능을 사용하려면 로그인해 주세요.", "warning");
                          return;
                        }
                        const val = document.getElementById('naver-link-email').value;
                        if (!val || !val.includes('@')) {
                          addToast("올바른 이메일 주소를 입력해주세요.", "error");
                          return;
                        }
                        setNaverEmail(val);
                        addToast(`Naver 계정이 연동 완료되었습니다. (${val})`, "success");
                      }}
                    >
                      연동하기
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="glass-card accent-rose">
            <h3 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)' }}>
              <AlertTriangle size={20} color="var(--accent)" />
              위험구역 (Danger Zone)
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
              계정 영구 탈퇴 및 데이터 완전 소멸 처리 구역입니다.
            </p>

            <div className="withdraw-box">
              <h5>⚠️ 회원 탈퇴 시 주의사항</h5>
              <ul>
                <li>현재 매칭되어 진행 중인 광고 캠페인 계약이 즉각 중단 및 무효 처리됩니다.</li>
                <li>안전거래 정산 에스크로에 예치된 보증금 잔액은 전액 소멸되어 복구되지 않습니다.</li>
                <li>등록하신 유튜브 API 포트폴리오 연동 및 CTR 통계 데이터가 즉시 삭제됩니다.</li>
              </ul>
            </div>

            {!isWithdrawModalOpen ? (
              <button 
                className="btn btn-danger" 
                style={{ width: '100%', marginTop: '24px' }}
                onClick={() => {
                  setIsWithdrawModalOpen(true);
                  setWithdrawConfirmName('');
                }}
              >
                Ad-Connect 서비스 탈퇴 신청
              </button>
            ) : (
              <div style={{ marginTop: '24px', background: 'rgba(244, 63, 94, 0.05)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
                <p style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--accent)', marginBottom: '12px' }}>
                  본인 확인을 위해 아래의 닉네임 명칭을 똑같이 입력해주십시오:
                </p>
                <p style={{ fontSize: '15px', fontWeight: '800', textAlign: 'center', background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', margin: '8px 0 16px 0', letterSpacing: '0.05em' }}>
                  {userName}
                </p>
                <div className="form-group">
                  <input 
                    type="text" 
                    className="input-control" 
                    placeholder="닉네임명을 정확히 입력하세요"
                    value={withdrawConfirmName}
                    onChange={(e) => setWithdrawConfirmName(e.target.value)}
                    style={{ borderColor: withdrawConfirmName === userName ? 'var(--secondary)' : 'var(--accent)' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button 
                    className="btn btn-secondary" 
                    style={{ flex: 1 }} 
                    onClick={() => setIsWithdrawModalOpen(false)}
                  >
                    탈퇴 취소
                  </button>
                  <button 
                    className="btn btn-danger" 
                    style={{ flex: 1 }} 
                    disabled={withdrawConfirmName !== userName}
                    onClick={async () => {
                      if (isGuestMode) {
                        addToast("둘러보기 모드에서는 읽기 전용입니다. 이 기능을 사용하려면 로그인해 주세요.", "warning");
                        return;
                      }
                      if (isBackendConnected) {
                        try {
                          const response = await fetch(`${API_BASE_URL}/users/withdraw`, {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({
                              email: userEmail,
                              confirmName: withdrawConfirmName
                            })
                          });
                          const data = await response.json();
                          if (response.ok) {
                            setIsLoggedIn(false);
                            setAuthInput({ email: '', password: '' });
                            setOtpCode(['', '', '', '', '', '']);
                            setToken('');
                            setIsWithdrawModalOpen(false);
                            navigate('/login');
                            addToast(data.message || "Ad-Connect 회원 탈퇴가 무사히 완료되었습니다.", "warning");
                          } else {
                            addToast(data.message || "회원 탈퇴 실패", "error");
                          }
                        } catch (err) {
                          addToast("백엔드 통신 오류", "error");
                        }
                      } else {
                        setIsLoggedIn(false);
                        setAuthInput({ email: '', password: '' });
                        setOtpCode(['', '', '', '', '', '']);
                        setIsWithdrawModalOpen(false);
                        navigate('/login');
                        addToast("Ad-Connect 회원 탈퇴가 안전하고 무사히 완료되었습니다. 이용해 주셔서 감사합니다. [모의 모드]", "warning");
                      }
                    }}
                  >
                    영구 탈퇴 승인
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
