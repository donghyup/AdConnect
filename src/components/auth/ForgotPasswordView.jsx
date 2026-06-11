import React from 'react';
import { Mail } from 'lucide-react';

export default function ForgotPasswordView({
  setAuthStep,
  addToast
}) {
  return (
    <div className="contract-form">
      <h3>비밀번호 찾기 / 재설정</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: '8px 0 20px 0' }}>
        가입하신 이메일 주소를 입력해 주시면 임시 비밀번호 발급 및 비밀번호 재설정 링크가 포함된 보안 인증 이메일을 발송해 드립니다.
      </p>
      <div className="form-group">
        <label>가입된 이메일 주소</label>
        <div className="search-input-wrapper">
          <Mail size={16} className="search-icon" />
          <input 
            type="email" 
            className="input-control" 
            placeholder="name@ad-connect.com"
            required 
          />
        </div>
      </div>
      <button 
        className="btn btn-primary" 
        style={{ width: '100%', marginTop: '12px' }}
        onClick={() => {
          addToast("비밀번호 재설정 보안 이메일이 무사히 발송되었습니다.", "success");
          setAuthStep('login');
        }}
      >
        비밀번호 재설정 이메일 발송
      </button>
      <button 
        className="btn btn-secondary" 
        style={{ width: '100%', marginTop: '8px' }}
        onClick={() => setAuthStep('login')}
      >
        로그인 화면으로 돌아가기
      </button>
    </div>
  );
}
