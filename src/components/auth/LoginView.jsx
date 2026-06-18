import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';

export default function LoginView({
  authInput,
  setAuthInput,
  handleLoginSubmit,
  setSignupForm,
  addToast
}) {
  const navigate = useNavigate();

  return (
    <form onSubmit={handleLoginSubmit} className="contract-form">
      <div className="form-group">
        <label>이메일 아이디</label>
        <div className="search-input-wrapper">
          <Mail size={16} className="search-icon" />
          <input 
            type="email" 
            className="input-control" 
            placeholder="name@ad-connect.com"
            value={authInput.email}
            onChange={e => setAuthInput({...authInput, email: e.target.value})}
            required 
          />
        </div>
      </div>

      <div className="form-group">
        <label>비밀번호</label>
        <div className="search-input-wrapper">
          <Lock size={16} className="search-icon" />
          <input 
            type="password" 
            className="input-control" 
            placeholder="••••••••"
            value={authInput.password}
            onChange={e => setAuthInput({...authInput, password: e.target.value})}
            required 
          />
        </div>
      </div>

      <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
        로그인
      </button>

      <div className="auth-footer-links">
        <span className="auth-link" onClick={() => addToast("가입하신 이메일은 가이드 메일 수신처 또는 데모용 계정을 참고하십시오.", "info")}>
          아이디 찾기
        </span>
        <span className="auth-link-divider">|</span>
        <span className="auth-link" onClick={() => navigate('/forgot')}>
          비밀번호 찾기
        </span>
        <span className="auth-link-divider">|</span>
        <span className="auth-link" onClick={() => {
          setSignupForm({
            role: 'creator',
            name: '',
            email: '',
            password: '',
            phone: '',
            sns: ''
          });
          navigate('/signup');
        }}>
          회원가입
        </span>
      </div>

      <div className="divider">소셜 계정 1초 로그인 연동</div>

      <div className="oauth-grid">
        <div className="oauth-btn google" onClick={() => {
          const currentOrigin = window.location.origin;
          const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
          if (!clientId) {
            addToast("Google Client ID 환경변수(VITE_GOOGLE_CLIENT_ID)가 설정되지 않았습니다.", "error");
            return;
          }
          window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(currentOrigin + '/oauth/callback')}&response_type=code&scope=email%20profile&state=google`;
        }}>
          <span style={{ fontSize: '16px', fontWeight: 'bold' }}>G</span>
          Google
        </div>
        <div className="oauth-btn kakao" onClick={() => {
          const currentOrigin = window.location.origin;
          const clientId = import.meta.env.VITE_KAKAO_CLIENT_ID;
          if (!clientId) {
            addToast("Kakao Client ID 환경변수(VITE_KAKAO_CLIENT_ID)가 설정되지 않았습니다.", "error");
            return;
          }
          window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(currentOrigin + '/oauth/callback')}&response_type=code&state=kakao`;
        }}>
          <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#3c1e1e' }}>K</span>
          Kakao
        </div>
        <div className="oauth-btn naver" onClick={() => {
          const currentOrigin = window.location.origin;
          const clientId = import.meta.env.VITE_NAVER_CLIENT_ID;
          if (!clientId) {
            addToast("Naver Client ID 환경변수(VITE_NAVER_CLIENT_ID)가 설정되지 않았습니다.", "error");
            return;
          }
          window.location.href = `https://nid.naver.com/oauth2.0/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(currentOrigin + '/oauth/callback')}&response_type=code&state=naver`;
        }}>
          <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#03c75a' }}>N</span>
          Naver
        </div>
      </div>
    </form>
  );
}
