import React from 'react';
import { Search, SlidersHorizontal, Megaphone, AlertTriangle, Play, Download } from 'lucide-react';

export default function MarketplaceView({
  userRole,
  userName,
  isGuestMode,
  ads,
  setAds,
  reports,
  setReports,
  chatRooms,
  setChatRooms,
  setActiveChatId,
  setCurrentView,
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
                <label>기한 설정</label>
                <input type="text" name="duration" className="input-control" placeholder="예: 2026-06-01 ~ 2026-07-01" required />
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
                {userRole === 'creator' && ad.status === '승인 완료' && (
                  <button 
                    className="btn btn-primary" 
                    style={{ padding: '8px 16px', fontSize: '12px' }}
                    onClick={() => {
                      if (isGuestMode) {
                        addToast("둘러보기 모드에서는 읽기 전용입니다. 이 기능을 사용하려면 로그인해 주세요.", "warning");
                        return;
                      }
                      addToast("이메일 및 카카오톡으로 매칭 지원서가 광고주에게 전달되었습니다.", "success");
                      
                      // Realtime chat creation simulator
                      const exists = chatRooms.find(r => r.id === ad.id);
                      if (!exists) {
                        const newRoom = {
                          id: ad.id,
                          name: `${ad.company} (캠페인 매칭 협상)`,
                          avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80",
                          lastMsg: "지원해 주셔서 감사합니다! 협의를 시작해 보시죠.",
                          time: "방금 전",
                          unread: 1,
                          online: true,
                          messages: [
                            { sender: 'them', text: `안녕하세요 크리에이터님! 등록하신 지원서 조회가 승인되었습니다. '${ad.title}' 캠페인 협업 조건 조율을 시작합니다.`, time: '방금 전' }
                          ]
                        };
                        setChatRooms([newRoom, ...chatRooms]);
                        setActiveChatId(ad.id);
                      }
                      setCurrentView('chat');
                    }}
                  >
                    캠페인 매칭 지원
                  </button>
                )}

                {userRole === 'admin' && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {ad.status === '승인 대기' && (
                      <>
                        <button 
                          className="btn btn-success" 
                          style={{ padding: '6px 12px', fontSize: '11px' }}
                          onClick={() => {
                            if (isGuestMode) {
                              addToast("둘러보기 모드에서는 읽기 전용입니다. 이 기능을 사용하려면 로그인해 주세요.", "warning");
                              return;
                            }
                            setAds(ads.map(a => a.id === ad.id ? { ...a, status: '승인 완료' } : a));
                            addToast("캠페인 승인이 완료되었습니다.", "success");
                          }}
                        >
                          승인
                        </button>
                        <button 
                          className="btn btn-danger" 
                          style={{ padding: '6px 12px', fontSize: '11px' }}
                          onClick={() => {
                            if (isGuestMode) {
                              addToast("둘러보기 모드에서는 읽기 전용입니다. 이 기능을 사용하려면 로그인해 주세요.", "warning");
                              return;
                            }
                            setAds(ads.map(a => a.id === ad.id ? { ...a, status: '반려' } : a));
                            addToast("캠페인이 반려 처리되었습니다.", "error");
                          }}
                        >
                          반려
                        </button>
                      </>
                    )}
                    <button 
                      className="btn btn-secondary" 
                      style={{ padding: '6px 12px', fontSize: '11px' }}
                      onClick={() => {
                        if (isGuestMode) {
                          addToast("둘러보기 모드에서는 읽기 전용입니다. 이 기능을 사용하려면 로그인해 주세요.", "warning");
                          return;
                        }
                        const newReport = {
                          id: Date.now(),
                          type: "유저 신고",
                          target: `광고 ID ${ad.id}: ${ad.title}`,
                          reporter: "최고 관리자 검수",
                          status: "대기 중",
                          date: new Date().toLocaleDateString('ko-KR')
                        };
                        setReports([newReport, ...reports]);
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
    </div>
  );
}
