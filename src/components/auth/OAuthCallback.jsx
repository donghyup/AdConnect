import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function OAuthCallback({
  API_BASE_URL,
  setToken,
  setUserRole,
  setUserName,
  setUserEmail,
  setUserPhone,
  setUserSns,
  setIsLoggedIn,
  setAuthStep,
  setCurrentView,
  addToast
}) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const provider = params.get('provider') || 'google';

    if (!code) {
      addToast("인가 코드가 올바르지 않습니다. 다시 로그인해 주세요.", "error");
      setAuthStep('login');
      return;
    }

    const exchangeCodeForToken = async () => {
      try {
        const endpoint = `${API_BASE_URL}/auth/${provider}`;
        console.log(`Exchanging OAuth code for token at endpoint: ${endpoint}`);

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ code })
        });

        const data = await response.json();

        if (response.ok) {
          // Store authentication states
          setToken(data.token);
          setUserRole(data.role);
          setUserName(data.name);
          setUserEmail(data.email);
          setUserPhone(data.phone || '미등록');
          setUserSns(data.sns || '미등록');
          setIsLoggedIn(true);

          addToast(`${provider.toUpperCase()} 소셜 로그인이 정상 완료되었습니다!`, "success");
          addToast(`환영합니다, ${data.name}님!`, "info");

          // Reset URL query parameters and redirect to dashboard view
          window.history.replaceState({}, document.title, window.location.pathname);
          setCurrentView('dashboard');
        } else {
          addToast(data.message || "소셜 로그인 승인에 실패했습니다.", "error");
          setAuthStep('login');
        }
      } catch (err) {
        console.error("Social login token exchange error:", err);
        addToast("소셜 로그인 승인 처리 도중 서버 통신 에러가 발생했습니다. API 키 구성을 확인해주세요.", "error");
        setAuthStep('login');
      }
    };

    exchangeCodeForToken();
  }, [API_BASE_URL]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      color: 'white',
      gap: '16px'
    }}>
      <Loader2 size={48} className="animate-spin" style={{ color: 'var(--primary)' }} />
      <h3 style={{ fontSize: '18px', fontWeight: '500' }}>소셜 계정 인증을 처리하는 중입니다</h3>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>잠시만 기다려 주십시오...</p>
    </div>
  );
}
