import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

export default function OtpVerifyView({
  otpCode,
  setOtpCode,
  handleOtpVerify
}) {
  const navigate = useNavigate();
  return (
    <div className="contract-form" style={{ textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
        <div className="kpi-icon rose" style={{ width: '60px', height: '60px', borderRadius: '50%' }}>
          <Lock size={28} />
        </div>
      </div>
      <h3>2단계 보안 인증 (OTP 2FA)</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: '8px 0 24px 0' }}>
        보안 강화를 위해 등록된 이메일 계정으로 발송된 6자리 일회용 보안 인증번호를 입력해 주십시오. (기본값: 임의 번호 입력 가능)
      </p>

      <div className="otp-box-container">
        {otpCode.map((digit, idx) => (
          <input
            key={idx}
            id={`otp-${idx}`}
            type="text"
            maxLength="1"
            className="otp-input"
            value={digit}
            onChange={e => {
              const val = e.target.value;
              const newOtp = [...otpCode];
              newOtp[idx] = val;
              setOtpCode(newOtp);
              
              // Focus next box automatically
              if (val && idx < 5) {
                const nextInput = document.getElementById(`otp-${idx+1}`);
                if (nextInput) nextInput.focus();
              }
            }}
            onKeyDown={e => {
              if (e.key === 'Backspace' && !otpCode[idx] && idx > 0) {
                const prevInput = document.getElementById(`otp-${idx-1}`);
                if (prevInput) prevInput.focus();
              }
            }}
          />
        ))}
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
        <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => navigate('/login')}>
          이전으로
        </button>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleOtpVerify}>
          최종 인증 완료
        </button>
      </div>
    </div>
  );
}
