import React from 'react';
import { Mail, Lock } from 'lucide-react';

export default function SignupView({
  signupForm,
  setSignupForm,
  handleSignupSubmit,
  setAuthStep
}) {
  return (
    <form onSubmit={handleSignupSubmit} className="contract-form">
      <h3>AD-CONNECT 신규 회원가입</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: '4px 0 16px 0' }}>
        크리에이터 혹은 광고주로 가입하여 다양한 매칭 혜택과 분석 서비스를 경험해 보세요.
      </p>

      <div className="form-group">
        <label>가입 역할 선택</label>
        <div className="payment-method-selector">
          <div 
            className={`payment-method-btn ${signupForm.role === 'creator' ? 'active' : ''}`}
            onClick={() => setSignupForm({...signupForm, role: 'creator'})}
          >
            크리에이터
          </div>
          <div 
            className={`payment-method-btn ${signupForm.role === 'advertiser' ? 'active' : ''}`}
            onClick={() => setSignupForm({...signupForm, role: 'advertiser'})}
          >
            광고주
          </div>
        </div>
      </div>

      <div className="form-group">
        <label>사용자 이름 / 기업명 *</label>
        <input 
          type="text" 
          className="input-control" 
          placeholder="예: 홍길동 또는 네오디지털"
          value={signupForm.name}
          onChange={e => setSignupForm({...signupForm, name: e.target.value})}
          required 
        />
      </div>

      <div className="form-group">
        <label>이메일 아이디 *</label>
        <div className="search-input-wrapper">
          <Mail size={16} className="search-icon" />
          <input 
            type="email" 
            className="input-control" 
            placeholder="name@ad-connect.com"
            value={signupForm.email}
            onChange={e => setSignupForm({...signupForm, email: e.target.value})}
            required 
          />
        </div>
      </div>

      <div className="form-group">
        <label>비밀번호 *</label>
        <div className="search-input-wrapper">
          <Lock size={16} className="search-icon" />
          <input 
            type="password" 
            className="input-control" 
            placeholder="비밀번호 설정"
            value={signupForm.password}
            onChange={e => setSignupForm({...signupForm, password: e.target.value})}
            required 
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div className="form-group">
          <label>연락처 (선택)</label>
          <input 
            type="text" 
            className="input-control" 
            placeholder="010-0000-0000"
            value={signupForm.phone || ''}
            onChange={e => setSignupForm({...signupForm, phone: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>SNS/웹 URL (선택)</label>
          <input 
            type="text" 
            className="input-control" 
            placeholder="youtube.com/..."
            value={signupForm.sns || ''}
            onChange={e => setSignupForm({...signupForm, sns: e.target.value})}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
        <button 
          type="button" 
          className="btn btn-secondary" 
          style={{ flex: 1 }}
          onClick={() => setAuthStep('login')}
        >
          이전으로
        </button>
        <button 
          type="submit" 
          className="btn btn-primary" 
          style={{ flex: 2 }}
        >
          회원가입 완료
        </button>
      </div>
    </form>
  );
}
