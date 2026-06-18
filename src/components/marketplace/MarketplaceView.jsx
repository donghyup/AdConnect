import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, Megaphone, AlertTriangle, Play, Download, Users, X, ClipboardList, MessageSquare, Pencil } from 'lucide-react';

export default function MarketplaceView({
  userRole,
  userName,
  userEmail,
  youtubeChannel,
  isGuestMode,
  ads,
  setAds,
  reports,
  setReports,
  chatRooms,
  setChatRooms,
  setActiveChatId,
  searchQuery,
  setSearchQuery,
  filterSubscriber,
  setFilterSubscriber,
  filterBudget,
  setFilterBudget,
  filterGenre,
  setFilterGenre,
  sortBy,
  setSortBy,
  handleAddCampaign,
  addToast,
  isBackendConnected,
  API_BASE_URL,
  token
}) {
  const navigate = useNavigate();

  // Applicants modal state (advertiser viewing who applied to their campaign)
  const [applicantsModal, setApplicantsModal] = useState(null); // { campaign, applicants, loading }

  // Creator's own application history (내 지원 현황)
  const [myApplications, setMyApplications] = useState([]);

  // Advertiser: applicant count per campaign (for at-a-glance badges)
  const [applicantCounts, setApplicantCounts] = useState({});

  // Advertiser: campaign being edited (null = closed)
  const [editCampaign, setEditCampaign] = useState(null);

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  });

  useEffect(() => {
    if (isBackendConnected && userRole === 'advertiser' && userName) {
      const params = new URLSearchParams({ role: 'advertiser', name: userName });
      fetch(`${API_BASE_URL}/applications/rooms?${params.toString()}`, { headers: authHeaders() })
        .then(r => r.ok ? r.json() : [])
        .then(rooms => {
          const counts = {};
          (Array.isArray(rooms) ? rooms : []).forEach(rm => {
            counts[rm.campaignId] = (counts[rm.campaignId] || 0) + 1;
          });
          setApplicantCounts(counts);
        })
        .catch(() => {});
    } else {
      setApplicantCounts({});
    }
  }, [isBackendConnected, userRole, userName, API_BASE_URL, token, ads]);

  useEffect(() => {
    if (isBackendConnected && userRole === 'creator' && userEmail) {
      fetch(`${API_BASE_URL}/applications/mine?email=${encodeURIComponent(userEmail)}`, { headers: authHeaders() })
        .then(r => r.ok ? r.json() : [])
        .then(data => setMyApplications(Array.isArray(data) ? data : []))
        .catch(() => {});
    } else {
      setMyApplications([]);
    }
  }, [isBackendConnected, userRole, userEmail, API_BASE_URL, token, ads]);

  const statusBadgeClass = (status) =>
    status === '수락' ? 'badge-emerald' : status === '거절' ? 'badge-rose' : 'badge-warning';

  // Data-driven matching: compare the creator's linked YouTube subscriber count
  // against a campaign's required minimum (e.g. "50,000+").
  const parseSubCount = (s) => {
    if (!s) return 0;
    const n = parseInt(String(s).replace(/[^0-9]/g, ''), 10);
    return isNaN(n) ? 0 : n;
  };
  const mySubscribers = youtubeChannel ? parseSubCount(youtubeChannel.subscribers) : null;

  // Returns { state: 'ok' | 'short' | 'nolink', required, mine }
  const checkEligibility = (ad) => {
    const required = parseSubCount(ad.subscribersRequired);
    if (mySubscribers === null) return { state: 'nolink', required, mine: 0 };
    if (mySubscribers >= required) return { state: 'ok', required, mine: mySubscribers };
    return { state: 'short', required, mine: mySubscribers };
  };

  // Creator applies to a campaign -> persist to backend, then open the chat room
  const handleApply = async (ad) => {
    if (isGuestMode) {
      addToast("둘러보기 모드에서는 읽기 전용입니다. 이 기능을 사용하려면 로그인해 주세요.", "warning");
      return;
    }

    // Data-driven eligibility gate: must have a linked channel that meets the
    // campaign's required subscriber count before applying.
    const elig = checkEligibility(ad);
    if (elig.state === 'nolink') {
      addToast("먼저 '유튜브 포트폴리오'에서 채널을 연동해야 지원할 수 있습니다.", "warning");
      return;
    }
    if (elig.state === 'short') {
      addToast(`이 캠페인은 구독자 ${elig.required.toLocaleString('ko-KR')}명 이상이 필요합니다. (현재 ${elig.mine.toLocaleString('ko-KR')}명)`, "error");
      return;
    }

    // Room id is the application id so the advertiser and creator share the exact
    // same 1:1 room. In mock mode we fall back to the campaign id.
    let roomId = ad.id;

    if (isBackendConnected) {
      try {
        const res = await fetch(`${API_BASE_URL}/applications`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({
            campaignId: ad.id,
            partnerEmail: userEmail,
            partnerName: userName,
            message: `${userName} 크리에이터(구독자 ${elig.mine.toLocaleString('ko-KR')}명)가 '${ad.title}' 캠페인에 지원했습니다.`
          })
        });
        if (!res.ok) {
          addToast("지원서 전송 중 오류가 발생했습니다.", "error");
          return;
        }
        const saved = await res.json();
        roomId = saved.id;
        addToast("매칭 지원서가 광고주에게 전달되었습니다.", "success");
      } catch (err) {
        addToast("백엔드 통신 중 오류가 발생했습니다.", "error");
        return;
      }
    } else {
      addToast("이메일 및 카카오톡으로 매칭 지원서가 광고주에게 전달되었습니다. [모의 모드]", "success");
    }

    // Open the negotiation chat room (real messages load from the backend on /chat)
    const exists = chatRooms.find(r => r.id === roomId);
    if (!exists) {
      const newRoom = {
        id: roomId,
        campaignId: ad.id,
        name: `${ad.company} (${ad.title})`,
        partnerName: ad.company,
        budget: ad.budget,
        avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80",
        lastMsg: "대화를 시작해 보세요.",
        time: "방금 전",
        unread: 0,
        online: true,
        messages: []
      };
      setChatRooms([newRoom, ...chatRooms]);
    }
    setActiveChatId(roomId);
    navigate('/chat');
  };

  // Admin approves / rejects a campaign — persisted to the backend so the
  // decision is visible to everyone and survives a refresh (no longer local-only).
  const updateCampaignStatus = async (ad, status, successMsg, toastType = 'success') => {
    if (isGuestMode) {
      addToast("둘러보기 모드에서는 읽기 전용입니다. 이 기능을 사용하려면 로그인해 주세요.", "warning");
      return;
    }
    if (isBackendConnected) {
      try {
        const res = await fetch(`${API_BASE_URL}/campaigns/${ad.id}/status`, {
          method: 'PATCH',
          headers: authHeaders(),
          body: JSON.stringify({ status })
        });
        if (res.ok) {
          setAds(ads.map(a => a.id === ad.id ? { ...a, status } : a));
          addToast(successMsg, toastType);
        } else {
          addToast("상태 변경에 실패했습니다.", "error");
        }
      } catch (err) {
        addToast("백엔드 통신 중 오류가 발생했습니다.", "error");
      }
    } else {
      setAds(ads.map(a => a.id === ad.id ? { ...a, status } : a));
      addToast(`${successMsg} [모의 모드]`, toastType);
    }
  };

  // Advertiser edits a campaign (only allowed before anyone applies)
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (isGuestMode) {
      addToast("둘러보기 모드에서는 읽기 전용입니다. 이 기능을 사용하려면 로그인해 주세요.", "warning");
      return;
    }
    const fd = new FormData(e.target);
    const start = fd.get('durationStart');
    const end = fd.get('durationEnd');
    const payload = {
      title: fd.get('title'),
      category: fd.get('category'),
      budget: Number(fd.get('budget')).toLocaleString('ko-KR'),
      subscribersRequired: fd.get('subscribers'),
      duration: (start && end) ? `${start} ~ ${end}` : (editCampaign.duration || ''),
      description: fd.get('description'),
      genre: fd.get('genre') || '기타',
      region: fd.get('region') || '전국'
    };

    if (isBackendConnected) {
      try {
        const res = await fetch(`${API_BASE_URL}/campaigns/${editCampaign.id}`, {
          method: 'PUT',
          headers: authHeaders(),
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok) {
          setAds(ads.map(a => a.id === editCampaign.id ? data : a));
          setEditCampaign(null);
          addToast("캠페인 내용이 수정되었습니다.", "success");
        } else {
          addToast(data.message || "수정에 실패했습니다.", "error");
        }
      } catch (err) {
        addToast("백엔드 통신 중 오류가 발생했습니다.", "error");
      }
    } else {
      setAds(ads.map(a => a.id === editCampaign.id ? { ...a, ...payload } : a));
      setEditCampaign(null);
      addToast("캠페인 내용이 수정되었습니다. [모의 모드]", "success");
    }
  };

  // Advertiser opens the applicant list for one of their campaigns
  const openApplicants = async (ad) => {
    if (!isBackendConnected) {
      setApplicantsModal({ campaign: ad, applicants: [], loading: false, mock: true });
      return;
    }
    setApplicantsModal({ campaign: ad, applicants: [], loading: true });
    try {
      const res = await fetch(`${API_BASE_URL}/applications/campaign/${ad.id}`, { headers: authHeaders() });
      const data = res.ok ? await res.json() : [];
      setApplicantsModal({ campaign: ad, applicants: data, loading: false });
    } catch (err) {
      addToast("지원자 목록을 불러오지 못했습니다.", "error");
      setApplicantsModal({ campaign: ad, applicants: [], loading: false });
    }
  };

  // Advertiser accepts / rejects an applicant
  const updateApplicantStatus = async (applicationId, status) => {
    if (!isBackendConnected) {
      setApplicantsModal(prev => prev ? {
        ...prev,
        applicants: prev.applicants.map(a => a.id === applicationId ? { ...a, status } : a)
      } : prev);
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/applications/${applicationId}/status`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const updated = await res.json();
        setApplicantsModal(prev => prev ? {
          ...prev,
          applicants: prev.applicants.map(a => a.id === applicationId ? updated : a)
        } : prev);
        // Notify the creator that their application was accepted
        if (status === '수락' && updated.partnerEmail) {
          const campaignTitle = applicantsModal?.campaign?.title || '캠페인';
          fetch(`${API_BASE_URL}/notifications`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({
              recipientEmail: updated.partnerEmail,
              text: `'${campaignTitle}' 캠페인 지원이 수락되었습니다! 협의 채팅에서 계약을 진행해 주세요.`,
              type: 'match',
              roomId: updated.id
            })
          }).catch(() => {});
        }
        addToast(`지원자를 '${status}' 처리했습니다.`, status === '수락' ? 'success' : 'info');
      } else {
        addToast("상태 변경에 실패했습니다.", "error");
      }
    } catch (err) {
      addToast("백엔드 통신 중 오류가 발생했습니다.", "error");
    }
  };
  // Filter & Sort campaign list
  const filteredAds = ads.filter(ad => {
    // Role filter: Admins can see all, Creators/Advertisers see approved/pending accordingly
    if (userRole !== 'admin') {
      if (ad.status !== '승인 완료' && ad.company !== userName) return false;
    }
    
    // Search query
    const matchSearch = ad.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        ad.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        ad.description.toLowerCase().includes(searchQuery.toLowerCase());
                        
    // Subscriber range
    let matchSub = true;
    if (filterSubscriber !== 'all') {
      if (filterSubscriber === 'small' && !ad.subscribersRequired.includes('10,000+')) matchSub = false;
      if (filterSubscriber === 'mid' && !ad.subscribersRequired.includes('30,000+') && !ad.subscribersRequired.includes('50,000+')) matchSub = false;
      if (filterSubscriber === 'large' && !ad.subscribersRequired.includes('100,000+')) matchSub = false;
    }
    
    // Budget range
    let matchBudget = true;
    if (filterBudget !== 'all') {
      const budgetNum = parseInt(ad.budget.replace(/,/g, ''));
      if (filterBudget === 'under2' && budgetNum >= 2000000) matchBudget = false;
      if (filterBudget === '2to5' && (budgetNum < 2000000 || budgetNum > 5000000)) matchBudget = false;
      if (filterBudget === 'over5' && budgetNum <= 5000000) matchBudget = false;
    }

    // Genre
    const matchGenre = filterGenre === 'all' || ad.genre === filterGenre;

    return matchSearch && matchSub && matchBudget && matchGenre;
  }).sort((a, b) => {
    if (sortBy === 'recent') return b.id - a.id;
    if (sortBy === 'budget') return parseInt(b.budget.replace(/,/g, '')) - parseInt(a.budget.replace(/,/g, ''));
    if (sortBy === 'views') return b.views - a.views;
    return 0;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Advanced Search & Filtering Controls */}
      <div className="glass-card">
        <div className="search-filter-bar">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              className="input-control" 
              placeholder="광고 캠페인 제목, 광고주 브랜드 명으로 스마트 검색..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <div className="form-group" style={{ width: '160px' }}>
              <select 
                className="input-control" 
                value={filterSubscriber}
                onChange={e => setFilterSubscriber(e.target.value)}
              >
                <option value="all">구독자 제한 (전체)</option>
                <option value="small">마이크로 (10,000+)</option>
                <option value="mid">미드티어 (30,000 ~ 50,000+)</option>
                <option value="large">메가 (100,000+)</option>
              </select>
            </div>

            <div className="form-group" style={{ width: '160px' }}>
              <select 
                className="input-control" 
                value={filterBudget}
                onChange={e => setFilterBudget(e.target.value)}
              >
                <option value="all">광고비 예산 (전체)</option>
                <option value="under2">200만 원 미만</option>
                <option value="2to5">200만 ~ 500만 원</option>
                <option value="over5">500만 원 초과</option>
              </select>
            </div>

            <div className="form-group" style={{ width: '140px' }}>
              <select 
                className="input-control" 
                value={filterGenre}
                onChange={e => setFilterGenre(e.target.value)}
              >
                <option value="all">콘텐츠 장르</option>
                <option value="테크">테크</option>
                <option value="게임">게임</option>
                <option value="브이로그">브이로그</option>
                <option value="요리">요리</option>
              </select>
            </div>

            <div className="form-group" style={{ width: '140px' }}>
              <select 
                className="input-control" 
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                <option value="recent">최신 활동량순</option>
                <option value="budget">높은 광고 단가순</option>
                <option value="views">과거 누적조회순</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Creator: my application history */}
      {userRole === 'creator' && myApplications.length > 0 && (
        <div className="glass-card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <ClipboardList size={18} color="var(--primary)" />
            내 지원 현황 ({myApplications.length})
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px' }}>
            내가 지원한 캠페인의 진행 상태입니다. 광고주가 수락하면 협의 채팅에서 계약을 진행하세요.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {myApplications.map(app => {
              const ad = ads.find(a => a.id === app.campaignId);
              return (
                <div
                  key={app.id}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {ad ? ad.title : `캠페인 #${app.campaignId}`}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {ad ? ad.company : ''}{ad ? ' · ' : ''}지급 광고비 ₩{ad ? ad.budget : '-'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                    <span className={`badge ${statusBadgeClass(app.status)}`}>{app.status}</span>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                      onClick={() => { setActiveChatId(app.id); navigate('/chat'); }}
                    >
                      <MessageSquare size={13} />
                      협의 채팅
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Campaign Creation Option for Advertisers */}
      {userRole === 'advertiser' && (
        <div className="glass-card accent-emerald">
          <h3 style={{ marginBottom: '16px' }}>새로운 광고주 캠페인 등록 및 의뢰</h3>
          <form onSubmit={handleAddCampaign} className="contract-form">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>캠페인 제목</label>
                <input type="text" name="title" className="input-control" placeholder="예: 무선 헤드폰 출시 PPL 영상 협업" required />
              </div>
              <div className="form-group">
                <label>카테고리</label>
                <select name="category" className="input-control">
                  <option value="테크/IT">테크/IT</option>
                  <option value="뷰티/헬스">뷰티/헬스</option>
                  <option value="게임">게임</option>
                  <option value="요리/푸드">요리/푸드</option>
                  <option value="일상/여행">일상/여행</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>광고 예산 집행금액 (원)</label>
                <input type="number" name="budget" className="input-control" placeholder="예: 3000000" required />
              </div>
              <div className="form-group">
                <label>최소 유튜브 구독자 기준</label>
                <input type="text" name="subscribers" className="input-control" placeholder="예: 50,000+" required />
              </div>
              <div className="form-group">
                <label>기한 설정 (시작 ~ 종료)</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="date" name="durationStart" className="input-control" required />
                  <input type="date" name="durationEnd" className="input-control" required />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>타겟 장르</label>
                <input type="text" name="genre" className="input-control" placeholder="예: 테크, 브이로그" />
              </div>
              <div className="form-group">
                <label>활동 가능 지역</label>
                <input type="text" name="region" className="input-control" placeholder="예: 서울, 전국" />
              </div>
            </div>

            <div className="form-group">
              <label>상세 캠페인 가이드 및 설명</label>
              <textarea name="description" className="input-control" rows="4" placeholder="제품의 명확한 장점 노출 요구조건 및 동영상 러닝타임 가이드라인 기재..." required></textarea>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '220px', alignSelf: 'flex-end' }}>
              새 캠페인 등록 (검수 요청)
            </button>
          </form>
        </div>
      )}

      {/* Ads Matching Feed Grid */}
      <div className="ad-grid">
        {filteredAds.length === 0 ? (
          <div className="glass-card" style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center' }}>
            <AlertTriangle size={48} color="var(--warning)" style={{ marginBottom: '16px' }} />
            <h3>조건에 부합하는 매칭 캠페인이 존재하지 않습니다.</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>필터 검색조건을 다양하게 조정해 보십시오.</p>
          </div>
        ) : (
          filteredAds.map(ad => (
            <div key={ad.id} className="glass-card ad-card">
              <div className="ad-header">
                <div>
                  <span className="ad-company">{ad.company}</span>
                  <h4 className="ad-title">{ad.title}</h4>
                </div>
                <span className={`badge ${ad.status === '승인 완료' ? 'badge-emerald' : ad.status === '승인 대기' ? 'badge-warning' : 'badge-rose'}`}>
                  {ad.status}
                </span>
              </div>

              <div className="ad-tags">
                <span className="badge badge-indigo">{ad.category}</span>
                <span className="badge badge-indigo">{ad.genre}</span>
                <span className="badge badge-indigo">{ad.region}</span>
              </div>

              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineBreak: 'anywhere', height: '60px', overflow: 'hidden' }}>
                {ad.description}
              </p>

              <div className="ad-meta-info">
                <div className="ad-meta-item">
                  <span className="ad-meta-label">지급 광고비</span>
                  <span className="ad-meta-value" style={{ color: 'var(--secondary)' }}>₩{ad.budget}</span>
                </div>
                <div className="ad-meta-item">
                  <span className="ad-meta-label">요구 구독자수</span>
                  <span className="ad-meta-value">{ad.subscribersRequired}</span>
                </div>
              </div>

              <div className="ad-footer">
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{ad.duration}</span>
                
                {/* Interactions based on role */}
                {userRole === 'creator' && ad.status === '승인 완료' && (() => {
                  const elig = checkEligibility(ad);
                  return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`badge ${elig.state === 'ok' ? 'badge-emerald' : elig.state === 'short' ? 'badge-rose' : 'badge-warning'}`} style={{ fontSize: '10px' }}>
                        {elig.state === 'ok' ? '✓ 자격 충족' : elig.state === 'short' ? `구독자 미달 (${elig.required.toLocaleString('ko-KR')}+ 필요)` : '채널 연동 필요'}
                      </span>
                      <button
                        className="btn btn-primary"
                        style={{ padding: '8px 16px', fontSize: '12px', opacity: elig.state === 'ok' ? 1 : 0.6 }}
                        onClick={() => handleApply(ad)}
                      >
                        캠페인 매칭 지원
                      </button>
                    </div>
                  );
                })()}

                {/* Advertiser: edit + view applicants for their own campaign */}
                {userRole === 'advertiser' && ad.company === userName && (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {!applicantCounts[ad.id] ? (
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '8px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                        onClick={() => setEditCampaign(ad)}
                      >
                        <Pencil size={14} />
                        수정
                      </button>
                    ) : (
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }} title="지원자가 있어 수정할 수 없습니다">
                        🔒 수정 잠김
                      </span>
                    )}
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '8px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                      onClick={() => openApplicants(ad)}
                    >
                      <Users size={14} />
                      지원자 보기
                      {applicantCounts[ad.id] > 0 && (
                        <span className="badge badge-indigo" style={{ padding: '1px 7px', fontSize: '11px' }}>
                          {applicantCounts[ad.id]}
                        </span>
                      )}
                    </button>
                  </div>
                )}

                {userRole === 'admin' && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {ad.status === '승인 대기' && (
                      <>
                        <button
                          className="btn btn-success"
                          style={{ padding: '6px 12px', fontSize: '11px' }}
                          onClick={() => updateCampaignStatus(ad, '승인 완료', "캠페인 승인이 완료되었습니다.")}
                        >
                          승인
                        </button>
                        <button
                          className="btn btn-danger"
                          style={{ padding: '6px 12px', fontSize: '11px' }}
                          onClick={() => updateCampaignStatus(ad, '반려', "캠페인이 반려 처리되었습니다.", "error")}
                        >
                          반려
                        </button>
                      </>
                    )}
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '11px' }}
                      onClick={async () => {
                        if (isGuestMode) {
                          addToast("둘러보기 모드에서는 읽기 전용입니다. 이 기능을 사용하려면 로그인해 주세요.", "warning");
                          return;
                        }
                        const payload = {
                          type: "유저 신고",
                          target: `광고 ID ${ad.id}: ${ad.title}`,
                          reporter: "최고 관리자 검수"
                        };
                        if (isBackendConnected) {
                          try {
                            const res = await fetch(`${API_BASE_URL}/reports`, {
                              method: 'POST', headers: authHeaders(), body: JSON.stringify(payload)
                            });
                            if (res.ok) {
                              const saved = await res.json();
                              setReports([saved, ...reports]);
                            }
                          } catch (err) { addToast("백엔드 통신 중 오류가 발생했습니다.", "error"); return; }
                        } else {
                          setReports([{ id: Date.now(), ...payload, status: "대기 중", date: new Date().toLocaleDateString('ko-KR') }, ...reports]);
                        }
                        addToast("부적절 광고 검수 신고 접수완료.", "warning");
                      }}
                    >
                      신고
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Campaign Modal (Advertiser, only before applicants) */}
      {editCampaign && (() => {
        const [dStart = '', dEnd = ''] = (editCampaign.duration || '').split(' ~ ');
        return (
          <div className="payment-modal-overlay" onClick={() => setEditCampaign(null)}>
            <div className="glass-card" style={{ width: '94%', maxWidth: '640px', maxHeight: '86vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3>캠페인 의뢰 내용 수정</h3>
                <button onClick={() => setEditCampaign(null)} style={{ background: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={20} /></button>
              </div>
              <form onSubmit={handleEditSubmit} className="contract-form">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label>캠페인 제목</label>
                    <input type="text" name="title" className="input-control" defaultValue={editCampaign.title} required />
                  </div>
                  <div className="form-group">
                    <label>카테고리</label>
                    <select name="category" className="input-control" defaultValue={editCampaign.category || '테크/IT'}>
                      <option value="테크/IT">테크/IT</option>
                      <option value="뷰티/헬스">뷰티/헬스</option>
                      <option value="게임">게임</option>
                      <option value="요리/푸드">요리/푸드</option>
                      <option value="일상/여행">일상/여행</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label>광고 예산 (원)</label>
                    <input type="number" name="budget" className="input-control" defaultValue={String(editCampaign.budget || '').replace(/,/g, '')} required />
                  </div>
                  <div className="form-group">
                    <label>최소 구독자 기준</label>
                    <input type="text" name="subscribers" className="input-control" defaultValue={editCampaign.subscribersRequired || ''} required />
                  </div>
                  <div className="form-group">
                    <label>기한 (시작 ~ 종료)</label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input type="date" name="durationStart" className="input-control" defaultValue={dStart} />
                      <input type="date" name="durationEnd" className="input-control" defaultValue={dEnd} />
                    </div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label>타겟 장르</label>
                    <input type="text" name="genre" className="input-control" defaultValue={editCampaign.genre || ''} />
                  </div>
                  <div className="form-group">
                    <label>활동 가능 지역</label>
                    <input type="text" name="region" className="input-control" defaultValue={editCampaign.region || ''} />
                  </div>
                </div>
                <div className="form-group">
                  <label>상세 캠페인 가이드 및 설명</label>
                  <textarea name="description" className="input-control" rows="4" defaultValue={editCampaign.description || ''} required></textarea>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setEditCampaign(null)}>취소</button>
                  <button type="submit" className="btn btn-primary">수정 내용 저장</button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}

      {/* Applicants Modal (Advertiser) */}
      {applicantsModal && (
        <div
          className="payment-modal-overlay"
          onClick={() => setApplicantsModal(null)}
        >
          <div
            className="glass-card"
            style={{ width: '92%', maxWidth: '560px', maxHeight: '80vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <h3 style={{ marginBottom: '4px' }}>지원자 목록</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{applicantsModal.campaign.title}</p>
              </div>
              <button onClick={() => setApplicantsModal(null)} style={{ background: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <X size={20} />
              </button>
            </div>

            {applicantsModal.loading ? (
              <p style={{ color: 'var(--text-muted)', padding: '24px 0', textAlign: 'center' }}>지원자 정보를 불러오는 중...</p>
            ) : applicantsModal.applicants.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
                <Users size={36} style={{ color: 'rgba(255,255,255,0.15)', marginBottom: '8px' }} />
                <p style={{ fontSize: '14px' }}>
                  {applicantsModal.mock ? '백엔드 미연결 상태에서는 지원자 조회가 제한됩니다. [모의 모드]' : '아직 지원한 크리에이터가 없습니다.'}
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                {applicantsModal.applicants.map(app => (
                  <div
                    key={app.id}
                    style={{ padding: '14px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <strong style={{ fontSize: '14px' }}>{app.partnerName}</strong>
                      <span className={`badge ${app.status === '수락' ? 'badge-emerald' : app.status === '거절' ? 'badge-rose' : 'badge-warning'}`}>
                        {app.status}
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>{app.partnerEmail}</p>
                    {app.message && <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{app.message}</p>}

                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                      <button
                        className="btn btn-success"
                        style={{ padding: '5px 12px', fontSize: '11px' }}
                        disabled={app.status === '수락'}
                        onClick={() => updateApplicantStatus(app.id, '수락')}
                      >
                        수락
                      </button>
                      <button
                        className="btn btn-danger"
                        style={{ padding: '5px 12px', fontSize: '11px' }}
                        disabled={app.status === '거절'}
                        onClick={() => updateApplicantStatus(app.id, '거절')}
                      >
                        거절
                      </button>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '5px 12px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '5px' }}
                        onClick={() => { setApplicantsModal(null); setActiveChatId(app.id); navigate('/chat'); }}
                      >
                        <MessageSquare size={12} />
                        협의 채팅
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
