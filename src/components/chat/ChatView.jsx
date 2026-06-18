import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Send } from 'lucide-react';

export default function ChatView({
  chatRooms,
  setChatRooms,
  activeChatId,
  setActiveChatId,
  userEmail,
  ads,
  setPaymentAmount,
  chatInputText,
  setChatInputText,
  handleSendMessage,
  addToast
}) {
  const navigate = useNavigate();
  const activeRoom = chatRooms.find(r => r.id === activeChatId);

  // A message is "mine" when its sender email matches the logged-in user.
  // Falls back to the legacy 'me'/'them' flag for mock-mode demo rooms.
  const isMine = (msg) => (msg.senderEmail && userEmail)
    ? msg.senderEmail === userEmail
    : msg.sender === 'me';

  return (
    <div className="glass-card" style={{ padding: 0 }}>
      <div className="chat-container">
        {/* Chat rooms list */}
        <div className="chat-rooms-list">
          <div className="chat-rooms-header">
            실시간 대화 목록 ({chatRooms.length})
          </div>
          <div className="chat-rooms">
            {chatRooms.map(room => (
              <div 
                key={room.id} 
                className={`chat-room-item ${room.id === activeChatId ? 'active' : ''}`}
                onClick={() => {
                  setActiveChatId(room.id);
                  // Read markers reset simulation
                  setChatRooms(chatRooms.map(r => r.id === room.id ? { ...r, unread: 0 } : r));
                }}
              >
                <div className="chat-room-avatar-wrapper">
                  <img src={room.avatar} alt="user" className="user-avatar" />
                  {room.online && <span className="active-dot"></span>}
                </div>

                <div className="chat-room-meta">
                  <div className="chat-room-name-bar">
                    <span className="chat-room-name">{room.name}</span>
                    <span className="chat-room-time">{room.time}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="chat-room-last-msg">{room.lastMsg}</span>
                    {room.unread > 0 && (
                      <span className="chat-unread-badge">{room.unread}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat window */}
        <div className="chat-window">
          {activeRoom ? (
            <>
              {/* Chat header */}
              <div className="chat-header">
                <div className="chat-header-user">
                  <img 
                    src={activeRoom.avatar} 
                    alt="user" 
                    className="user-avatar" 
                  />
                  <div>
                    <h4 style={{ fontSize: '15px' }}>{activeRoom.name}</h4>
                    <span style={{ fontSize: '11px', color: 'var(--secondary)' }}>
                      ● 실시간 STOMP 프로토콜 암호화 채널 연결 완료
                    </span>
                  </div>
                </div>

                <button 
                  className="btn btn-secondary"
                  style={{ padding: '8px 16px', fontSize: '12px' }}
                  onClick={() => {
                    // Prefer the room's own campaign/budget (real 1:1 rooms carry it),
                    // falling back to a campaign lookup for legacy mock rooms.
                    const ad = ads.find(a => a.id === (activeRoom.campaignId || activeChatId));
                    const amount = activeRoom.budget || (ad && ad.budget);
                    if (amount) {
                      setPaymentAmount(amount);
                    }
                    navigate('/contracts');
                    addToast("연계 계약서 작성 화면으로 이동했습니다.", "success");
                  }}
                >
                  계약 및 안전 결제 작성
                </button>
              </div>

              {/* Chat Messages */}
              <div className="chat-messages">
                {activeRoom.messages.map((msg, i) => (
                  <div key={i} className={`chat-msg-bubble-wrapper ${isMine(msg) ? 'sent' : 'received'}`}>
                    <div className="chat-msg-bubble">
                      {msg.text}
                    </div>
                    <span className="chat-msg-time">
                      {msg.time} {isMine(msg) && <span style={{ color: 'var(--secondary)' }}><Check size={10} /> 읽음</span>}
                    </span>
                  </div>
                ))}
              </div>

              {/* Chat Input bar */}
              <div className="chat-input-bar">
                <input 
                  type="text" 
                  className="input-control" 
                  placeholder="실시간 STOMP 협업 메시지 전송..."
                  value={chatInputText}
                  onChange={e => setChatInputText(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                />
                <button className="btn btn-primary" onClick={handleSendMessage} style={{ padding: '12px' }}>
                  <Send size={16} />
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
              선택된 대화방이 없습니다. 왼쪽 대화방 목록에서 선택해 주세요.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
