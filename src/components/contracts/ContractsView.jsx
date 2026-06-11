import React, { useState, useRef } from 'react';
import { ShieldCheck, FileText } from 'lucide-react';

export default function ContractsView({
  paymentAmount,
  userRole,
  isGuestMode,
  setShowPaymentModal,
  signedContract,
  signatureSaved,
  setSignatureSaved,
  saveSignature,
  clearSignature,
  handleContractSubmit,
  userName,
  theme,
  addToast
}) {
  const sigCanvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Canvas drawing logic
  const startDrawing = (e) => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    // Support touch events as well
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.strokeStyle = '#1e293b'; // Slate grey for high-contrast on light background
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureSaved(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div className="glass-card">
        <h3>전자 계약 & 에스크로 안전 정산 시스템</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
          크리에이터와 광고주가 체결할 법적 구속력을 가진 전자 계약서 초안입니다. 전자서명 완료 및 PortOne(토스 페이먼츠) 대금 에치와 동시에 계약 효력이 시작됩니다.
        </p>

        <div style={{ display: 'flex', gap: '20px', marginTop: '24px' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="portfolio-stat" style={{ textAlign: 'left', background: 'rgba(99, 102, 241, 0.05)', borderColor: 'var(--primary)' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} color="var(--primary)" />
                안전 거래 에스크로 보증금 결제 정보
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '8px 0' }}>
                광고주는 수수료 3%를 제외한 금액을 플랫폼 안전 정산 계좌에 예치해야 합니다. 작업물이 최종 업로드 완료되어 광고주 승인이 나면 지급 처리됩니다.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px' }}>
                <span style={{ fontWeight: 'bold' }}>예치 보증금: ₩{paymentAmount}</span>
                {userRole === 'advertiser' && (
                  <button 
                    className="btn btn-success" 
                    style={{ padding: '6px 12px', fontSize: '12px' }}
                    onClick={() => {
                      if (isGuestMode) {
                        addToast("둘러보기 모드에서는 읽기 전용입니다. 이 기능을 사용하려면 로그인해 주세요.", "warning");
                        return;
                      }
                      setShowPaymentModal(true);
                    }}
                  >
                    Toss Payments 보증금 결제
                  </button>
                )}
              </div>
            </div>

            {/* Electronic Contract Paper */}
            <div className="contract-paper" style={{ position: 'relative' }}>
              <div className="contract-title">광고 콘텐츠 제작 매칭 협업 계약서</div>

              <div className="contract-section">
                <div className="contract-section-title">제 1 조 (목적)</div>
                <p>본 계약은 광고주(이하 '갑')가 요청한 브랜드 상품 홍보를 위한 브랜디드 비디오 제작 및 송출 업무를 크리에이터(이하 '을')에게 위탁하며, 양 당사자의 협업 의무를 규정함을 목적으로 한다.</p>
              </div>

              <div className="contract-section">
                <div className="contract-section-title">제 2 조 (제작 사양 및 가이드라인)</div>
                <table className="contract-details-table">
                  <tbody>
                    <tr>
                      <td className="label">프로젝트 명</td>
                      <td>네오핏 Pro 스마트워치 신제품 웰메이드 리뷰 및 브랜디드 가이드</td>
                    </tr>
                    <tr>
                      <td className="label">콘텐츠 형태</td>
                      <td>유튜브 15분 내외 고품질 웰메이드 영상 1편 + 고정 댓글 링크 삽입</td>
                    </tr>
                    <tr>
                      <td className="label">계약 대금</td>
                      <td>₩{paymentAmount} (일시불, 원천세 및 수수료 3% 별도 공제 후 정산)</td>
                    </tr>
                    <tr>
                      <td className="label">제출 및 송출일</td>
                      <td>2026년 06월 01일 오후 6시 이전</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="contract-section">
                <div className="contract-section-title">제 3 조 (대금의 결제 및 정산)</div>
                <p>
                  '갑'은 계약금 총액 ₩{paymentAmount}을 'Ad-Connect' 플랫폼의 에스크로(안전 결제)를 활용하여 선결제 완료해야 한다. '을'이 완성된 콘텐츠를 송출 완료하고 최종 검수가 승인되면 플랫폼은 대금을 즉시 '을'에게 정산 지급한다.
                </p>
              </div>

              {/* Signed status stamp */}
              {signedContract ? (
                <div style={{ position: 'absolute', top: '40px', right: '40px', border: '3px double var(--secondary)', color: 'var(--secondary)', transform: 'rotate(15deg)', padding: '8px 16px', borderRadius: '8px', fontSize: '18px', fontWeight: '800', background: 'var(--bg-secondary)', textShadow: '0 0 8px rgba(16, 185, 129, 0.2)' }}>
                  CONTRACT SIGNED<br />
                  <span style={{ fontSize: '10px' }}>SHA-256 SECURED</span>
                </div>
              ) : null}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: '60px', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
                <div>
                  <strong>광고주 ('갑'):</strong>
                  <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>네오스마트 주식회사 대표이사 김민준 (서명 생략 - 법인 공동인증 완료)</p>
                </div>
                <div>
                  <strong>크리에이터 ('을'):</strong>
                  <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>{userName} (아래 서명 날인)</p>
                  
                  {signedContract ? (
                    <div style={{ marginTop: '12px', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                      <p style={{ fontSize: '12px', color: 'var(--secondary)', fontWeight: 'bold' }}>✓ 서명 체결 완료</p>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>체결 일자: {signedContract.date}</p>
                      <p style={{ fontSize: '9px', color: 'var(--text-muted)', wordBreak: 'break-all' }}>보안 해시: {signedContract.signHash}</p>
                    </div>
                  ) : (
                    <p style={{ color: 'var(--accent)', fontSize: '12px', marginTop: '12px' }}>서명 대기 중</p>
                  )}
                </div>
              </div>
            </div>

            {/* Interactive Canvas Signature Pad */}
            {!signedContract && (
              <div className="signature-pad-container">
                <h4>크리에이터 전자서명 서약</h4>
                <canvas 
                  ref={sigCanvasRef}
                  width="400" 
                  height="180" 
                  className="signature-canvas"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>마우스 또는 터치를 활용하여 하얀 캔버스 박스 영역 내에 서명해 주십시오.</p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button className="btn btn-secondary" onClick={handleClear}>
                    새로 지우기
                  </button>
                  <button className="btn btn-success" onClick={saveSignature}>
                    서명 정보 저장
                  </button>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
              {!signedContract ? (
                <button className="btn btn-primary" onClick={handleContractSubmit} style={{ width: '280px' }}>
                  최종 서명 전자 계약서 제출
                </button>
              ) : (
                <button className="btn btn-secondary" style={{ width: '280px' }} onClick={() => addToast("계약서가 PDF 파일로 안전 다운로드 되었습니다.", "success")}>
                  <FileText size={16} />
                  체결 완료된 PDF 계약서 보관 다운로드
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
