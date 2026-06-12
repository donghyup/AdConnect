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
        addToast("소셜 서버와 통신 도중 오류가 발생했습니다. 데모 모드를 진행합니다.", "warning");

        // Mock Fallback Client Side for robust demoing
        const mockSocialUser = {
          token: "mock_social_jwt_token_" + Date.now(),
          role: provider === 'kakao' ? 'advertiser' : 'creator', // Advertiser for Kakao, Creator for Google
          name: provider === 'kakao' ? "카카오 광고주 (데모)" : "구글 크리에이터 (데모)",
          email: provider === 'kakao' ? "social-kakao@kakao.com" : "social-google@gmail.com",
          phone: "010-9999-8888",
          sns: provider === 'kakao' ? "kakaocorp.com" : "youtube.com/c/social_google"
        };

        setToken(mockSocialUser.token);
        setUserRole(mockSocialUser.role);
        setUserName(mockSocialUser.name);
        setUserEmail(mockSocialUser.email);
        setUserPhone(mockSocialUser.phone);
        setUserSns(mockSocialUser.sns);
        setIsLoggedIn(true);

        addToast(`[모의] ${provider.toUpperCase()} 소셜 로그인이 완료되었습니다.`, "success");
        window.history.replaceState({}, document.title, window.location.pathname);
        setCurrentView('dashboard');
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
