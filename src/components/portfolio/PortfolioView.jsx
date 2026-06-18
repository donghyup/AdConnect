import React from 'react';
import { RefreshCw, Play, PlayCircle, ShieldCheck } from 'lucide-react';

export default function PortfolioView({
  userName,
  userEmail,
  portfolioStats,
  handleYoutubeOAuthVerify,
  isSyncingYoutube,
  youtubeVideos,
  youtubeChannel
}) {
  const isLinked = !!youtubeChannel;

  const onConnect = () => {
    handleYoutubeOAuthVerify();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div className="glass-card">
        <div className="portfolio-header">
          <img
            src={
              isLinked && youtubeChannel.thumbnail
                ? youtubeChannel.thumbnail
                : "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80"
            }
            alt="creator"
            className="portfolio-avatar"
          />
          <div className="portfolio-profile">
            {isLinked ? (
              <span className="badge badge-emerald">구독 인증됨 (YouTube Partner)</span>
            ) : (
              <span className="badge" style={{ background: 'rgba(148,163,184,0.15)', color: 'var(--text-secondary)' }}>
                유튜브 채널 미연동
              </span>
            )}
            <h3 className="portfolio-name">{isLinked ? youtubeChannel.title : userName}</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              {isLinked
                ? (youtubeChannel.description
                    ? youtubeChannel.description.slice(0, 80) + (youtubeChannel.description.length > 80 ? '…' : '')
                    : '연동된 유튜브 채널의 실시간 통계입니다.')
                : '내 유튜브 채널을 연동하면 실제 구독자수와 영상 통계가 표시됩니다.'}
            </p>

            {isLinked && (
              <div className="portfolio-sns" style={{ marginTop: '12px' }}>
                <span>유튜브: <strong style={{ color: 'white' }}>
                  {youtubeChannel.customUrl || `youtube.com/channel/${youtubeChannel.channelId}`}
                </strong></span>
                {userEmail && (
                  <>
                    <span>•</span>
                    <span>이메일: <strong style={{ color: 'white' }}>{userEmail}</strong></span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Channel connect / sync control */}
        <div
          style={{
            marginTop: '20px',
            padding: '16px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <ShieldCheck size={18} style={{ color: 'var(--secondary)' }} />
            <strong style={{ fontSize: '14px' }}>
              {isLinked ? '내 유튜브 채널 (소유권 인증됨)' : 'Google 계정으로 내 채널 인증하기'}
            </strong>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '12px', lineHeight: 1.5 }}>
            {isLinked
              ? 'Google 인증으로 연동된 본인 채널입니다. 통계를 다시 불러오려면 갱신을 눌러 주세요.'
              : '버튼을 누르면 Google 로그인 후 본인 소유의 채널만 자동으로 연동됩니다. 타인 채널 도용이 원천 차단됩니다. (입력·코드 불필요)'}
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary"
              onClick={onConnect}
              disabled={isSyncingYoutube}
            >
              {isSyncingYoutube ? (
                <>
                  <RefreshCw size={16} className="pulse" style={{ marginRight: '8px' }} />
                  Google 인증 처리 중...
                </>
              ) : isLinked ? (
                <>
                  <RefreshCw size={16} style={{ marginRight: '8px' }} />
                  동기화 갱신
                </>
              ) : (
                <>
                  <ShieldCheck size={16} style={{ marginRight: '8px' }} />
                  Google로 내 채널 인증하기
                </>
              )}
            </button>
          </div>
        </div>

        <div className="portfolio-stats-grid" style={{ marginTop: '24px' }}>
          <div className="portfolio-stat">
            <div className="portfolio-stat-val">{portfolioStats.subscribers}{portfolioStats.subscribers !== '—' ? '명' : ''}</div>
            <div className="portfolio-stat-lbl">실시간 자동연동 구독자 수</div>
          </div>
          <div className="portfolio-stat">
            <div className="portfolio-stat-val">{portfolioStats.avgViews}{portfolioStats.avgViews !== '—' ? '회' : ''}</div>
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
      </div>

      <div className="glass-card">
        <h3>최근 업로드 영상 목록 (조회수 자동 분석 포함)</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
          YouTube API를 경유하여 크리에이터 피드에서 가장 인기 있는 동영상 3건을 실시간 분석합니다.
        </p>

        {youtubeVideos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            <PlayCircle size={40} style={{ color: 'rgba(255,255,255,0.15)', marginBottom: '12px' }} />
            <p style={{ fontSize: '14px' }}>
              {isLinked
                ? '가져온 영상이 없습니다.'
                : '아직 연동된 채널이 없습니다. 위에서 유튜브 채널을 연동해 주세요.'}
            </p>
          </div>
        ) : (
          <div className="youtube-videos">
            {youtubeVideos.map(video => (
              <a
                key={video.id}
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="video-card"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="video-thumbnail-wrapper">
                  <img src={video.image} alt={video.title} className="video-thumbnail" />
                  {video.duration && <span className="video-duration">{video.duration}</span>}
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
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
