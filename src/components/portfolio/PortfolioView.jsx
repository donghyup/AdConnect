import React from 'react';
import { RefreshCw, Play } from 'lucide-react';

export default function PortfolioView({
  userName,
  portfolioStats,
  handleYoutubeSync,
  isSyncingYoutube,
  youtubeVideos
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div className="glass-card">
        <div className="portfolio-header">
          <img 
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80" 
            alt="creator" 
            className="portfolio-avatar" 
          />
          <div className="portfolio-profile">
            <span className="badge badge-emerald">구독 인증됨 (YouTube Partner)</span>
            <h3 className="portfolio-name">{userName}</h3>
            <p style={{ color: 'var(--text-secondary)' }}>주요 장르: IT 디바이스 정밀 리뷰, 생산성 생산도구 개발 및 가이드</p>
            
            <div className="portfolio-sns" style={{ marginTop: '12px' }}>
              <span>유튜브: <strong style={{ color: 'white' }}>youtube.com/c/creator_j</strong></span>
              <span>•</span>
              <span>인스타그램: <strong style={{ color: 'white' }}>@creator_j_official</strong></span>
              <span>•</span>
              <span>이메일: <strong style={{ color: 'white' }}>j-creator@gmail.com</strong></span>
            </div>
          </div>
        </div>

        <div className="portfolio-stats-grid">
          <div className="portfolio-stat">
            <div className="portfolio-stat-val">{portfolioStats.subscribers}명</div>
            <div className="portfolio-stat-lbl">실시간 자동연동 구독자 수</div>
          </div>
          <div className="portfolio-stat">
            <div className="portfolio-stat-val">{portfolioStats.avgViews}회</div>
            <div className="portfolio-stat-lbl">최근 영상 평균 조회수</div>
          </div>
          <div className="portfolio-stat">
            <div className="portfolio-stat-val">{portfolioStats.successRate}</div>
            <div className="portfolio-stat-lbl">광고주 협업 성공 만족도</div>
          </div>
          <div className="portfolio-stat">
            <div className="portfolio-stat-val">{portfolioStats.collabCount}</div>
            <div className="portfolio-stat-lbl">Ad-Connect 협업 누적 이력</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
          <button 
            className="btn btn-primary" 
            onClick={handleYoutubeSync}
            disabled={isSyncingYoutube}
          >
            {isSyncingYoutube ? (
              <>
                <RefreshCw size={16} className="pulse" style={{ marginRight: '8px' }} />
                YouTube API 실시간 연동 중...
              </>
            ) : (
              <>
                <RefreshCw size={16} style={{ marginRight: '8px' }} />
                유튜브 데이터 동기화 갱신
              </>
            )}
          </button>
        </div>
      </div>

      <div className="glass-card">
        <h3>최근 업로드 영상 목록 (조회수 자동 분석 포함)</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>YouTube API를 경유하여 크리에이터 피드에서 가장 인기 있는 동영상 3건을 실시간 분석합니다.</p>

        <div className="youtube-videos">
          {youtubeVideos.map(video => (
            <div key={video.id} className="video-card">
              <div className="video-thumbnail-wrapper">
                <img src={video.image} alt={video.title} className="video-thumbnail" />
                <span className="video-duration">{video.duration}</span>
                <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(234, 67, 53, 0.95)', color: 'white', display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>
                  <Play size={10} fill="white" />
                  YouTube
                </div>
              </div>

              <div className="video-info">
                <h4 className="video-title">{video.title}</h4>
                <div className="video-stats">
                  <span>조회수 <strong>{video.views}</strong></span>
                  <span>•</span>
                  <span>좋아요 <strong>{video.likes}</strong></span>
                  <span>•</span>
                  <span>댓글 <strong>{video.comments}</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
