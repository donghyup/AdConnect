import React from 'react';
import { Mail, Lock } from 'lucide-react';

export default function LoginView({
  authInput,
  setAuthInput,
  handleLoginSubmit,
  setAuthStep,
  setSignupForm,
  addToast
}) {
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
        JWT 로그인 요청하기
      </button>

      <div className="auth-footer-links">
        <span className="auth-link" onClick={() => addToast("가입하신 이메일은 가이드 메일 수신처 또는 데모용 계정을 참고하십시오.", "info")}>
          아이디 찾기
        </span>
        <span className="auth-link-divider">|</span>
        <span className="auth-link" onClick={() => setAuthStep('forgot')}>
          비밀번호 찾기
        </span>
        <span className="auth-link-divider">|</span>
        <span className="auth-link" onClick={() => {
          setAuthStep('signup');
          setSignupForm({
            role: 'creator',
            name: '',
            email: '',
            password: '',
            phone: '',
            sns: ''
          });
        }}>
          회원가입
        </span>
      </div>

      <div className="divider">소셜 계정 1초 로그인 연동</div>

      <div className="oauth-grid">
        <div className="oauth-btn google" onClick={() => addToast("Google 소셜 로그인은 현재 준비 중입니다. 일반 이메일 로그인을 이용해 주세요.", "warning")}>
          <span style={{ fontSize: '16px', fontWeight: 'bold' }}>G</span>
          Google
        </div>
        <div className="oauth-btn kakao" onClick={() => addToast("카카오 소셜 로그인은 현재 준비 중입니다. 일반 이메일 로그인을 이용해 주세요.", "warning")}>
          <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#3c1e1e' }}>K</span>
          Kakao
        </div>
        <div className="oauth-btn naver" onClick={() => addToast("네이버 소셜 로그인은 현재 준비 중입니다. 일반 이메일 로그인을 이용해 주세요.", "warning")}>
          <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#03c75a' }}>N</span>
          Naver
        </div>
      </div>
    </form>
  );
}
