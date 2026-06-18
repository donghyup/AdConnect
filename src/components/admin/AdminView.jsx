import React from 'react';

export default function AdminView({
  reports,
  setReports,
  ads,
  setAds,
  isGuestMode,
  isBackendConnected,
  API_BASE_URL,
  token,
  addToast
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div className="glass-card">
        <h3>플랫폼 보안 검수 및 스팸 댓글 신고 통합 피드</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
          플랫폼 내 부적절한 불법 광고 및 사기성 스팸 의심 신고를 관리하고 제어하는 실시간 통합 관리 패널입니다.
        </p>

        <div className="admin-table-wrapper" style={{ marginTop: '24px' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>신고 ID</th>
                <th>구분 유형</th>
                <th>신고 내용 대상</th>
                <th>신고 접수자</th>
                <th>상태</th>
                <th>접수 일자</th>
                <th>관리 조치</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(report => (
                <tr key={report.id}>
                  <td>#{report.id}</td>
                  <td>
                    <span className={`badge ${report.type && report.type.includes('스팸') ? 'badge-warning' : 'badge-rose'}`}>
                      {report.type}
                    </span>
                  </td>
                  <td style={{ fontWeight: 'bold' }}>{report.target}</td>
                  <td>{report.reporter}</td>
                  <td>
                    <span className={`badge ${report.status === '처리 완료' ? 'badge-emerald' : 'badge-warning'}`}>
                      {report.status}
                    </span>
                  </td>
                  <td>{report.date}</td>
                  <td>
                    {report.status === '대기 중' ? (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="btn btn-primary"
                          style={{ padding: '6px 12px', fontSize: '11px' }}
                          onClick={async () => {
                            if (isGuestMode) {
                              addToast("둘러보기 모드에서는 읽기 전용입니다. 이 기능을 사용하려면 로그인해 주세요.", "warning");
                              return;
                            }
                            if (isBackendConnected) {
                              try {
                                const res = await fetch(`${API_BASE_URL}/reports/${report.id}/status`, {
                                  method: 'PATCH',
                                  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                  body: JSON.stringify({ status: '처리 완료' })
                                });
                                if (!res.ok) { addToast("조치 처리에 실패했습니다.", "error"); return; }
                              } catch (err) { addToast("백엔드 통신 중 오류가 발생했습니다.", "error"); return; }
                            }
                            setReports(reports.map(r => r.id === report.id ? { ...r, status: '처리 완료' } : r));
                            addToast("해당 신고 대상물 차단 및 영구 블락 조치가 완료되었습니다.", "success");
                          }}
                        >
                          블랙리스트 조치
                        </button>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '11px' }}
                          onClick={async () => {
                            if (isGuestMode) {
                              addToast("둘러보기 모드에서는 읽기 전용입니다. 이 기능을 사용하려면 로그인해 주세요.", "warning");
                              return;
                            }
                            if (isBackendConnected) {
                              try {
                                const res = await fetch(`${API_BASE_URL}/reports/${report.id}`, {
                                  method: 'DELETE',
                                  headers: { 'Authorization': `Bearer ${token}` }
                                });
                                if (!res.ok) { addToast("기각 처리에 실패했습니다.", "error"); return; }
                              } catch (err) { addToast("백엔드 통신 중 오류가 발생했습니다.", "error"); return; }
                            }
                            setReports(reports.filter(r => r.id !== report.id));
                            addToast("신고가 반려 처리되었습니다.", "info");
                          }}
                        >
                          기각
                        </button>
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>조치 완료됨</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass-card">
        <h3>전체 광고 승인 대기 목록 (검수 모듈)</h3>
        <div className="admin-table-wrapper" style={{ marginTop: '16px' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>회사 브랜드명</th>
                <th>의뢰 광고 캠페인명</th>
                <th>지급 광고비</th>
                <th>가이드 등록 상태</th>
                <th>승인 승낙조치</th>
              </tr>
            </thead>
            <tbody>
              {ads.filter(a => a.status === '승인 대기').map(ad => (
                <tr key={ad.id}>
                  <td style={{ fontWeight: 'bold' }}>{ad.company}</td>
                  <td>{ad.title}</td>
                  <td style={{ color: 'var(--secondary)' }}>₩{ad.budget}</td>
                  <td><span className="badge badge-warning">{ad.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className="btn btn-success" 
                        style={{ padding: '6px 12px', fontSize: '11px' }}
                        onClick={async () => {
                          if (isGuestMode) {
                            addToast("둘러보기 모드에서는 읽기 전용입니다. 이 기능을 사용하려면 로그인해 주세요.", "warning");
                            return;
                          }
                          if (isBackendConnected) {
                            try {
                              const response = await fetch(`${API_BASE_URL}/campaigns/${ad.id}/status`, {
                                method: 'PATCH',
                                headers: {
                                  'Content-Type': 'application/json',
                                  'Authorization': `Bearer ${token}`
                                },
                                body: JSON.stringify({ status: '승인 완료' })
                              });
                              if (response.ok) {
                                setAds(ads.map(a => a.id === ad.id ? { ...a, status: '승인 완료' } : a));
                                addToast("신규 광고 의뢰에 대한 검수 승인을 성공했습니다.", "success");
                              }
                            } catch (err) {
                              addToast("백엔드 통신 중 오류가 발생했습니다.", "error");
                            }
                          } else {
                            setAds(ads.map(a => a.id === ad.id ? { ...a, status: '승인 완료' } : a));
                            addToast("신규 광고 의뢰에 대한 검수 승인을 성공했습니다. [모의 모드]", "success");
                          }
                        }}
                      >
                        검수 승인
                      </button>
                      <button 
                        className="btn btn-danger" 
                        style={{ padding: '6px 12px', fontSize: '11px' }}
                        onClick={async () => {
                          if (isGuestMode) {
                            addToast("둘러보기 모드에서는 읽기 전용입니다. 이 기능을 사용하려면 로그인해 주세요.", "warning");
                            return;
                          }
                          if (isBackendConnected) {
                            try {
                              const response = await fetch(`${API_BASE_URL}/campaigns/${ad.id}/status`, {
                                method: 'PATCH',
                                headers: {
                                  'Content-Type': 'application/json',
                                  'Authorization': `Bearer ${token}`
                                },
                                body: JSON.stringify({ status: '반려' })
                              });
                              if (response.ok) {
                                setAds(ads.map(a => a.id === ad.id ? { ...a, status: '반려' } : a));
                                addToast("사유 불충분으로 검수 반려되었습니다.", "error");
                              }
                            } catch (err) {
                              addToast("백엔드 통신 중 오류가 발생했습니다.", "error");
                            }
                          } else {
                            setAds(ads.map(a => a.id === ad.id ? { ...a, status: '반려' } : a));
                            addToast("사유 불충분으로 검수 반려되었습니다. [모의 모드]", "error");
                          }
                        }}
                      >
                        반려
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
