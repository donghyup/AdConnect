import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Sun, Moon, X } from 'lucide-react';
import { SimpleStompClient } from './utils/stomp';

// Common Components
import ToastContainer from './components/common/ToastContainer';
import Sidebar from './components/common/Sidebar';
import TopHeader from './components/common/TopHeader';

// Auth Components
import LandingView from './components/auth/LandingView';
import LoginView from './components/auth/LoginView';
import SignupView from './components/auth/SignupView';
import ForgotPasswordView from './components/auth/ForgotPasswordView';
import OtpVerifyView from './components/auth/OtpVerifyView';
import InstallView from './components/auth/InstallView';
import OAuthCallback from './components/auth/OAuthCallback';

// Page Views
import DashboardView from './components/dashboard/DashboardView';
import MarketplaceView from './components/marketplace/MarketplaceView';
import PortfolioView from './components/portfolio/PortfolioView';
import ChatView from './components/chat/ChatView';
import ContractsView from './components/contracts/ContractsView';
import AdminView from './components/admin/AdminView';
import MyPageView from './components/mypage/MyPageView';

/* ==========================================================================
   Mock Data & Predefined Constants
   ========================================================================== */

const INITIAL_ADS = [];

const ANALYTICS_TREND = [
  { name: "5/10", 조회수: 12000, CTR: 2.1, CVR: 0.8 },
  { name: "5/12", 조회수: 24000, CTR: 2.8, CVR: 1.1 },
  { name: "5/14", 조회수: 45000, CTR: 3.5, CVR: 1.5 },
  { name: "5/16", 조회수: 58000, CTR: 3.2, CVR: 1.4 },
  { name: "5/18", 조회수: 82000, CTR: 4.1, CVR: 1.8 },
  { name: "5/20", 조회수: 112000, CTR: 4.5, CVR: 2.2 },
  { name: "5/22", 조회수: 185000, CTR: 5.2, CVR: 2.6 }
];

const ANALYTICS_ROI = [
  { name: "AI 스마트워치 리뷰", ROI: 154, 예산: 3500000, 매출: 5390000 },
  { name: "저당 다이어트 PPL", ROI: 122, 예산: 1800000, 매출: 2196000 },
  { name: "신작 MMORPG 사전예약", ROI: 210, 예산: 6000000, 매출: 12600000 }
];

const INITIAL_CHAT_ROOMS = [
  {
    id: 1,
    name: "네오스마트 (캠페인 매칭 협상)",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80",
    lastMsg: "대화를 시작해 보세요.",
    time: "오전 10:30",
    unread: 0,
    online: true,
    messages: []
  },
  {
    id: 2,
    name: "플레이아레나 (캠페인 매칭 협상)",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    lastMsg: "대화를 시작해 보세요.",
    time: "어제",
    unread: 0,
    online: false,
    messages: []
  }
];
const INITIAL_NOTIFICATIONS = [];
const INITIAL_REPORTS = [];
const INITIAL_YOUTUBE_VIDEOS = [];

/* ==========================================================================
   Main Application Component
   ========================================================================== */

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentView = location.pathname.substring(1) || 'dashboard';
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

  // Real-time WebSocket connection state simulation
  const [wsStatus, setWsStatus] = useState('DISCONNECTED');
  const stompClientRef = useRef(null);
  const [stompConnected, setStompConnected] = useState(false);

  // Theme state
  const [theme, setTheme] = useState('dark');

  // Hybrid App download URL state (points to public/adconnect-release.apk)
  const [appDownloadUrl, setAppDownloadUrl] = useState(window.location.origin + '/adconnect-release.apk');
  const [iosDownloadUrl, setIosDownloadUrl] = useState(window.location.origin + '/api/manifest');

  // Install Mode state (triggered via ?mode=install search parameter)
  const [isInstallMode, setIsInstallMode] = useState(false);
  const [isOAuthCallbackMode, setIsOAuthCallbackMode] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'install') {
      setIsInstallMode(true);
    }
    if (window.location.pathname.includes('/oauth/callback') || params.has('code')) {
      setIsOAuthCallbackMode(true);
    }
  }, []);

  // Backend Connection States
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');

  // Auth & Role state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [mockOtp, setMockOtp] = useState('');
  const [googleEmail, setGoogleEmail] = useState('');
  const [kakaoEmail, setKakaoEmail] = useState('');
  const [naverEmail, setNaverEmail] = useState('');
  const [authInput, setAuthInput] = useState({ email: '', password: '' });
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [userRole, setUserRole] = useState('creator'); // creator | advertiser | admin
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userSns, setUserSns] = useState('');

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  // Heartbeat check for backend connection
  useEffect(() => {
    const checkHeartbeat = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/heartbeat`);
        if (response.ok) {
          setIsBackendConnected(true);
        } else {
          setIsBackendConnected(false);
        }
      } catch (err) {
        setIsBackendConnected(false);
      }
    };

    checkHeartbeat();
    const interval = setInterval(checkHeartbeat, 5000);
    return () => clearInterval(interval);
  }, []);

  // Dynamic user storage for signup simulation (persisted in localStorage)
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem('registeredUsers');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  const [signupForm, setSignupForm] = useState({
    role: 'creator',
    name: '',
    email: '',
    password: '',
    phone: '',
    sns: ''
  });

  // Navigation
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // My Page form states
  const [profileForm, setProfileForm] = useState({ name: '', email: '', phone: '', sns: '' });
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [withdrawConfirmName, setWithdrawConfirmName] = useState('');
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  // Sync profileForm when view or profile states change
  useEffect(() => {
    setProfileForm({
      name: userName,
      email: userEmail,
      phone: userPhone,
      sns: userSns
    });
  }, [currentView, userName, userEmail, userPhone, userSns]);

  // Application State Data
  const [ads, setAds] = useState(INITIAL_ADS);
  const [chatRooms, setChatRooms] = useState(INITIAL_CHAT_ROOMS);
  const [activeChatId, setActiveChatId] = useState(1);

  // Fetch campaigns from backend when online
  useEffect(() => {
    if (isBackendConnected) {
      const fetchCampaigns = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/campaigns`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setAds(data);
          }
        } catch (err) {
          console.error("Failed to fetch campaigns from backend", err);
        }
      };
      fetchCampaigns();
    }
  }, [isBackendConnected, token]);

  // Fetch chat messages from backend when online and in chat view (REST Fallback Polling)
  useEffect(() => {
    if (isBackendConnected && isLoggedIn && currentView === 'chat' && !stompConnected) {
      const fetchChatMessages = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/chat/rooms/${activeChatId}/messages`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setChatRooms(prevRooms =>
              prevRooms.map(room => {
                if (room.id === activeChatId) {
                  return {
                    ...room,
                    messages: data,
                    lastMsg: data.length > 0 ? data[data.length - 1].text : room.lastMsg,
                    time: data.length > 0 ? data[data.length - 1].time : room.time
                  };
                }
                return room;
              })
            );
          }
        } catch (err) {
          console.error("Failed to fetch messages from backend", err);
        }
      };

      fetchChatMessages();
      const interval = setInterval(fetchChatMessages, 2000);
      return () => clearInterval(interval);
    }
  }, [isBackendConnected, isLoggedIn, activeChatId, currentView, token, stompConnected]);

  const [chatInputText, setChatInputText] = useState('');
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [toasts, setToasts] = useState([]);
  
  // WebSocket Connection Management
  useEffect(() => {
    if (isBackendConnected && isLoggedIn) {
      setWsStatus('CONNECTING');
      const client = new SimpleStompClient(API_BASE_URL);
      stompClientRef.current = client;

      client.connect(
        () => {
          setStompConnected(true);
          setWsStatus('CONNECTED');
          addToast("실시간 알림 및 채팅 웹소켓에 연결되었습니다.", "success");
        },
        (err) => {
          console.error("STOMP connection failed:", err);
          setStompConnected(false);
          setWsStatus('DISCONNECTED');
          addToast("웹소켓 연결에 실패하여 REST Polling(Fallback) 방식으로 전환합니다.", "warning");
        }
      );

      client.onDisconnectCallbacks.push(() => {
        setStompConnected(false);
        setWsStatus('DISCONNECTED');
      });

      return () => {
        client.disconnect();
        stompClientRef.current = null;
        setStompConnected(false);
        setWsStatus('DISCONNECTED');
      };
    } else {
      setStompConnected(false);
      setWsStatus('DISCONNECTED');
    }
  }, [isBackendConnected, isLoggedIn]);

  // WebSocket Subscription to active chat room
  useEffect(() => {
    if (stompConnected && stompClientRef.current && activeChatId) {
      console.log(`Subscribing to /topic/rooms/${activeChatId}`);
      
      const fetchInitialMessages = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/chat/rooms/${activeChatId}/messages`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setChatRooms(prevRooms =>
              prevRooms.map(room => {
                if (room.id === activeChatId) {
                  return {
                    ...room,
                    messages: data,
                    lastMsg: data.length > 0 ? data[data.length - 1].text : room.lastMsg,
                    time: data.length > 0 ? data[data.length - 1].time : room.time
                  };
                }
                return room;
              })
            );
          }
        } catch (err) {
          console.error("Failed to load initial chat history for websocket subscription", err);
        }
      };
      
      fetchInitialMessages();

      const subscription = stompClientRef.current.subscribe(
        `/topic/rooms/${activeChatId}`,
        (message) => {
          console.log("Received WebSocket message:", message);
          setChatRooms(prevRooms =>
            prevRooms.map(room => {
              if (room.id === activeChatId) {
                const messageExists = room.messages.some(m => m.id && m.id === message.id);
                if (messageExists) return room;
                
                return {
                  ...room,
                  lastMsg: message.text,
                  time: message.time,
                  messages: [...room.messages, message]
                };
              }
              return room;
            })
          );

          if (currentView !== 'chat' && message.sender !== 'me') {
            const newNotif = {
              id: Date.now(),
              text: `${message.sender === 'them' ? '상대방' : message.sender}님으로부터 신규 메시지가 도착했습니다.`,
              type: 'chat',
              time: '방금 전',
              unread: true,
              roomId: activeChatId
            };
            setNotifications(prev => [newNotif, ...prev]);
            addToast("새로운 실시간 메시지가 도착했습니다.", "info");
          }
        }
      );

      return () => {
        console.log(`Unsubscribing from /topic/rooms/${activeChatId}`);
        subscription.unsubscribe();
      };
    }
  }, [stompConnected, activeChatId, token]);

  // Portfolios
  const [youtubeVideos, setYoutubeVideos] = useState(INITIAL_YOUTUBE_VIDEOS);
  const [isSyncingYoutube, setIsSyncingYoutube] = useState(false);
  const [portfolioStats, setPortfolioStats] = useState({
    subscribers: "124,500",
    avgViews: "84,530",
    successRate: "97.4%",
    collabCount: "12건"
  });

  // Contract & E-Signature Pad
  const [signatureSaved, setSignatureSaved] = useState(false);
  const [signedContract, setSignedContract] = useState(null); // active contract signature state

  // Toss Payments Gateway Simulator Modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("3,500,000");
  const [paymentMethod, setPaymentMethod] = useState("card"); // card | toss

  // Advanced Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubscriber, setFilterSubscriber] = useState('all');
  const [filterBudget, setFilterBudget] = useState('all');
  const [filterGenre, setFilterGenre] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  // Toast triggers
  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Toggle Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Toss Payments Confirmation
  const confirmPayment = async (paymentKey, orderId, amount) => {
    addToast("결제 승인을 요청 중입니다...", "info");
    if (isBackendConnected) {
      try {
        const response = await fetch(`${API_BASE_URL}/payments/confirm`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ paymentKey, orderId, amount })
        });
        const data = await response.json();
        if (response.ok) {
          addToast(`토스페이먼츠 ${Number(amount).toLocaleString('ko-KR')}원 에스크로 결제가 완료되었습니다.`, "success");
          addToast("정산 안전 예치금으로 안전하게 보관 처리되었습니다.", "info");
          
          const notif = {
            id: Date.now(),
            text: `캠페인 예산 ₩${Number(amount).toLocaleString('ko-KR')}원 결제가 완료되었습니다. 정산 보증금이 지급 대기 중입니다.`,
            type: 'match',
            time: '방금 전',
            unread: true
          };
          setNotifications(prev => [notif, ...prev]);
        } else {
          addToast(`결제 승인 실패: ${data.message || '알 수 없는 오류'}`, "error");
        }
      } catch (err) {
        addToast("결제 승인 중 통신 오류가 발생했습니다.", "error");
      }
    } else {
      addToast(`[Mock] 토스페이먼츠 ${Number(amount).toLocaleString('ko-KR')}원 에스크로 결제가 무사히 완료되었습니다.`, "success");
      addToast("정산 안전 예치금으로 관리자 계좌에 보관 처리되었습니다. [모의 모드]", "info");
      
      const notif = {
        id: Date.now(),
        text: `캠페인 예산 ₩${Number(amount).toLocaleString('ko-KR')}원 결제가 완료되었습니다. [모의 모드]`,
        type: 'match',
        time: '방금 전',
        unread: true
      };
      setNotifications(prev => [notif, ...prev]);
    }
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get('payment_status');
    const paymentKey = params.get('paymentKey');
    const orderId = params.get('orderId');
    const amount = params.get('amount');

    if (paymentStatus === 'success' && paymentKey && orderId && amount) {
      confirmPayment(paymentKey, orderId, amount);
    } else if (paymentStatus === 'fail') {
      const msg = params.get('message') || '결제 중 오류가 발생했거나 취소되었습니다.';
      addToast(`결제 실패: ${msg}`, 'error');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [isBackendConnected, token]);

  // Handle sending message via WebSocket if connected, otherwise fallback to REST API
  const handleSendMessage = async () => {
    if (!chatInputText.trim()) return;

    if (isGuestMode) {
      addToast("둘러보기 모드에서는 읽기 전용입니다. 이 기능을 사용하려면 로그인해 주세요.", "warning");
      return;
    }

    const messagePayload = {
      roomId: activeChatId,
      sender: 'me',
      senderEmail: userEmail,
      text: chatInputText
    };

    // 1. WebSocket STOMP send attempt
    if (stompConnected && stompClientRef.current && stompClientRef.current.connected) {
      const sent = stompClientRef.current.send(
        '/app/chat/send',
        {},
        JSON.stringify(messagePayload)
      );
      if (sent) {
        setChatInputText('');
        addToast("메시지가 전송되었습니다 (WebSocket 전송)", "success");
        return;
      }
    }

    // 2. Fallback: REST API send
    if (isBackendConnected) {
      try {
        const response = await fetch(`${API_BASE_URL}/chat/messages/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(messagePayload)
        });

        if (response.ok) {
          const savedMsg = await response.json();
          setChatInputText('');
          addToast("메시지가 전송되었습니다 (API Fallback 전송)", "success");
          
          setChatRooms(prevRooms =>
            prevRooms.map(room => {
              if (room.id === activeChatId) {
                if (room.messages.some(m => m.id && m.id === savedMsg.id)) return room;
                return {
                  ...room,
                  lastMsg: savedMsg.text,
                  time: savedMsg.time,
                  messages: [...room.messages, savedMsg]
                };
              }
              return room;
            })
          );
        }
      } catch (err) {
        addToast("백엔드 통신 중 오류가 발생했습니다.", "error");
      }
    } else {
      // 3. Mock Mode send
      const newMsg = {
        sender: 'me',
        text: chatInputText,
        time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      };

      setChatRooms(prevRooms =>
        prevRooms.map(room => {
          if (room.id === activeChatId) {
            return {
              ...room,
              lastMsg: chatInputText,
              time: "방금 전",
              messages: [...room.messages, newMsg]
            };
          }
          return room;
        })
      );

      const userText = chatInputText;
      setChatInputText('');
      addToast("메시지가 전송되었습니다 (STOMP WebSocket 모의 전송)", "success");

      // Simulating auto-reply
      setTimeout(() => {
        let replyText = "확인했습니다. 곧 검토 후 피드백 드리겠습니다!";
        if (activeChatId === 1) {
          if (userText.includes("시나리오") || userText.includes("스토리보드")) {
            replyText = "좋습니다! 전달해주시는 스토리보드 시안 보고 가이드 라인에 맞는지 팀 회의 거쳐서 최종 승인해 드릴게요. 꼼꼼히 챙겨주셔서 고맙습니다.";
          } else if (userText.includes("계약") || userText.includes("서명")) {
            replyText = "네, 정산금 결제와 동시에 전자 서명이 함께 저장되도록 연동되어 있습니다. 진행 후 말씀해 주세요.";
          }
        } else if (activeChatId === 2) {
          replyText = "포트원 결제 연동 모듈을 통해 안전하게 에스크로 결제 완료되는대로 최종 촬영 착수해주시면 됩니다.";
        }

        const replyMsg = {
          sender: 'them',
          text: replyText,
          time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
        };

        setChatRooms(prevRooms =>
          prevRooms.map(room => {
            if (room.id === activeChatId) {
              return {
                ...room,
                lastMsg: replyText,
                time: "방금 전",
                unread: room.unread + 1,
                messages: [...room.messages, replyMsg]
              };
            }
            return room;
          })
        );

        // Trigger dynamic notification
        const newNotif = {
          id: Date.now(),
          text: `${chatRooms.find(r => r.id === activeChatId).name}님으로부터 신규 메시지가 도착했습니다.`,
          type: 'chat',
          time: '방금 전',
          unread: true,
          roomId: activeChatId
        };
        setNotifications(prev => [newNotif, ...prev]);
        addToast("새로운 실시간 메시지가 도착했습니다.", "info");
      }, 2500);
    }
  };

  const saveSignature = () => {
    if (isGuestMode) {
      addToast("둘러보기 모드에서는 읽기 전용입니다. 이 기능을 사용하려면 로그인해 주세요.", "warning");
      return;
    }
    setSignatureSaved(true);
    addToast("전자 서명이 안전하게 암호화(SHA-256) 저장되었습니다.", "success");
  };

  const handleContractSubmit = () => {
    if (isGuestMode) {
      addToast("둘러보기 모드에서는 읽기 전용입니다. 이 기능을 사용하려면 로그인해 주세요.", "warning");
      return;
    }
    if (!signatureSaved) {
      addToast("먼저 서명을 기입하고 저장해 주세요.", "warning");
      return;
    }
    setSignedContract({
      date: new Date().toLocaleDateString('ko-KR'),
      status: "완료됨",
      signHash: "hash_049fb882cc914f6bde88"
    });
    // Notification append
    const notif = {
      id: Date.now(),
      text: "'네오스마트'와의 광고 계약서 전자서명 체결이 최종 완료되었습니다.",
      type: 'contract',
      time: '방금 전',
      unread: true
    };
    setNotifications(prev => [notif, ...prev]);
    addToast("광고 체결 계약 완료! 양 당사자에게 PDF 파일이 이메일 전송되었습니다.", "success");
  };

  // Sync Youtube Portfolio Simulate
  const handleYoutubeSync = () => {
    setIsSyncingYoutube(true);
    addToast("YouTube API 연동을 통한 최신 영상 데이터 가져오는 중...", "info");
    setTimeout(() => {
      setIsSyncingYoutube(false);
      setPortfolioStats({
        subscribers: "128,700 (▲ 4,200)",
        avgViews: "92,100 (▲ 7,570)",
        successRate: "98.2%",
        collabCount: "13건"
      });
      // Append a newly fetched video simulation
      const newVideo = {
        id: "v4",
        title: "[AD-Connect 협업] 다이어트 중 단 거 땡길 때 필수! 0칼로리 저당 에이드 1주일 식단 후기",
        views: "18,400회",
        likes: "920개",
        comments: "140개",
        duration: "08:52",
        image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=60"
      };
      setYoutubeVideos(prev => [newVideo, ...prev]);
      addToast("유튜브 채널 구독자수 및 통계 실시간 최신화 완료!", "success");
    }, 2000);
  };

  // Toss Payments Complete
  const executePayment = () => {
    if (isGuestMode) {
      addToast("둘러보기 모드에서는 읽기 전용입니다. 이 기능을 사용하려면 로그인해 주세요.", "warning");
      return;
    }

    setShowPaymentModal(false);

    try {
      const numericAmount = Number(paymentAmount.replace(/,/g, ''));
      if (isNaN(numericAmount) || numericAmount <= 0) {
        addToast("올바르지 않은 결제 금액입니다.", "error");
        return;
      }

      // Initialize Toss Payments SDK (VITE_TOSS_CLIENT_KEY env variable, with test key fallback)
      const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY || "test_ck_D5aZMgX43o7aNVDRw1rrV5j8n4d1";
      if (!window.TossPayments) {
        addToast("토스페이먼츠 SDK가 아직 로드되지 않았습니다.", "error");
        return;
      }
      
      const tossPayments = window.TossPayments(clientKey);
      
      // Request payment
      tossPayments.requestPayment(paymentMethod === 'card' ? '카드' : '토스페이', {
        amount: numericAmount,
        orderId: 'adconnect-' + Date.now(),
        orderName: '캠페인 보증금 예치',
        customerName: userName || '크리에이터',
        successUrl: window.location.origin + '?payment_status=success',
        failUrl: window.location.origin + '?payment_status=fail',
      }).catch((err) => {
        addToast(`결제창 호출 실패: ${err.message}`, "error");
      });
    } catch (err) {
      addToast(`결제 요청 준비 중 오류 발생: ${err.message}`, "error");
    }
  };

  // Add a Campaign Ad (Advertiser View)
  const handleAddCampaign = async (e) => {
    e.preventDefault();
    if (isGuestMode) {
      addToast("둘러보기 모드에서는 읽기 전용입니다. 이 기능을 사용하려면 로그인해 주세요.", "warning");
      return;
    }
    const formData = new FormData(e.target);
    
    const campaignData = {
      company: userName,
      title: formData.get('title'),
      category: formData.get('category'),
      budget: Number(formData.get('budget')).toLocaleString('ko-KR'),
      subscribersRequired: formData.get('subscribers'),
      duration: formData.get('duration'),
      description: formData.get('description'),
      genre: formData.get('genre') || '기타',
      region: formData.get('region') || '전국'
    };

    if (isBackendConnected) {
      try {
        const response = await fetch(`${API_BASE_URL}/campaigns/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(campaignData)
        });

        if (response.ok) {
          const saved = await response.json();
          setAds([saved, ...ads]);
          addToast("신규 광고가 등록되었습니다. 관리자의 승인 대기 중입니다.", "warning");
          navigate('/marketplace');
        } else {
          addToast("광고 등록 중 오류가 발생했습니다.", "error");
        }
      } catch (err) {
        addToast("백엔드 서버 통신 중 오류가 발생했습니다.", "error");
      }
    } else {
      const newCampaign = {
        id: ads.length + 1,
        company: userName,
        title: campaignData.title,
        category: campaignData.category,
        budget: campaignData.budget,
        subscribersRequired: campaignData.subscribersRequired,
        status: "승인 대기",
        clicks: 0,
        views: 0,
        registrations: 0,
        duration: campaignData.duration,
        description: campaignData.description,
        genre: campaignData.genre,
        region: campaignData.region,
        likes: 0,
        comments: 0
      };

      setAds([newCampaign, ...ads]);
      addToast("신규 광고가 등록되었습니다. 관리자의 승인 대기 중입니다. [모의 모드]", "warning");
      navigate('/marketplace');
    }
  };

  // Login handler
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!authInput.email || !authInput.password) {
      addToast("아이디와 비밀번호를 모두 입력해 주세요.", "error");
      return;
    }

    if (isBackendConnected) {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: authInput.email,
            password: authInput.password
          })
        });

        const data = await response.json();

        if (response.ok) {
          navigate('/otp');
          setUserEmail(authInput.email);
          addToast(data.message || "이메일로 6자리 2차 OTP 인증 번호가 발송되었습니다.", "info");
        } else {
          addToast(data.message || "로그인 요청에 실패했습니다.", "error");
        }
      } catch (err) {
        addToast("백엔드 서버 통신 중 오류가 발생했습니다.", "error");
      }
    } else {
      const foundUser = registeredUsers.find(
        u => u.email.toLowerCase() === authInput.email.toLowerCase() && u.password === authInput.password
      );

      if (!foundUser) {
        addToast("등록되지 않은 계정이거나 이메일/비밀번호가 다릅니다.", "error");
        return;
      }

      setUserRole(foundUser.role);
      setUserName(foundUser.name);
      setUserEmail(foundUser.email);
      setUserPhone(foundUser.phone || '미등록');
      setUserSns(foundUser.sns || '미등록');

      // Generate a random 6-digit mock OTP
      const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setMockOtp(randomOtp);

      navigate('/otp');
      addToast("이메일로 6자리 2차 OTP 인증 번호가 발송되었습니다. [모의 모드]", "info");
      addToast(`[테스트용 OTP] 인증번호는 [${randomOtp}] 입니다.`, "success");
    }
  };

  // OTP verify handler
  const handleOtpVerify = async () => {
    const fullOtp = otpCode.join('');
    if (fullOtp.length < 6) {
      addToast("인증 코드 6자리를 완전히 입력해 주세요.", "warning");
      return;
    }

    if (isBackendConnected) {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/otp/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: userEmail,
            otp: fullOtp
          })
        });

        const data = await response.json();

        if (response.ok) {
          setToken(data.token);
          setUserRole(data.role);
          setUserName(data.name);
          setUserPhone(data.phone || '미등록');
          setUserSns(data.sns || '미등록');
          setIsLoggedIn(true);
          addToast(data.message || "2차 보안 인증 및 로그인이 정상 완료되었습니다.", "success");
          addToast(`환영합니다! ${data.name}님, ${data.role.toUpperCase()} 역할로 입장했습니다.`, "info");
        } else {
          addToast(data.message || "OTP 인증에 실패했습니다.", "error");
        }
      } catch (err) {
        addToast("백엔드 서버 통신 중 오류가 발생했습니다.", "error");
      }
    } else {
      if (fullOtp !== mockOtp) {
        addToast("OTP 인증번호가 올바르지 않습니다. 다시 입력해 주세요.", "error");
        return;
      }
      setIsLoggedIn(true);
      addToast("JWT 기반 사용자 2차 인증 및 보안 로그인이 정상 승인되었습니다. [모의 모드]", "success");
      addToast(`환영합니다! ${userName}님, ${userRole.toUpperCase()} 역할로 입장했습니다.`, "info");
    }
  };

  // Switch Role Utility (Pre-fills forms with credentials for smooth testing)
  const handleRoleToggle = (role) => {
    setUserRole(role);
    const mockAccounts = {
      creator: { email: 'j-creator@gmail.com', password: 'password123' },
      advertiser: { email: 'mj.kim@neosmart.com', password: 'password123' },
      admin: { email: 'admin@ad-connect.com', password: 'password123' }
    };
    
    if (mockAccounts[role]) {
      setAuthInput(mockAccounts[role]);
    }
    addToast(`역할 권한이 ${role.toUpperCase()}(으)로 성공적으로 세팅되었습니다.`, "success");
  };

  // Dynamic Signup Submission Handler
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!signupForm.name || !signupForm.email || !signupForm.password) {
      addToast("필수 가입 양식을 기입해 주십시오.", "warning");
      return;
    }

    if (isBackendConnected) {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            role: signupForm.role,
            name: signupForm.name,
            email: signupForm.email,
            password: signupForm.password,
            phone: signupForm.phone,
            sns: signupForm.sns
          })
        });

        const data = await response.json();

        if (response.ok) {
          setAuthInput({ email: signupForm.email, password: signupForm.password });
          setUserRole(signupForm.role);
          addToast(data.message || "회원가입이 완료되었습니다! 가입하신 정보로 바로 로그인하실 수 있습니다.", "success");
          navigate('/login');
          setSignupForm({
            role: 'creator',
            name: '',
            email: '',
            password: '',
            phone: '',
            sns: ''
          });
        } else {
          addToast(data.message || "회원가입에 실패했습니다.", "error");
        }
      } catch (err) {
        addToast("백엔드 서버 통신 중 오류가 발생했습니다.", "error");
      }
    } else {
      if (registeredUsers.some(u => u.email.toLowerCase() === signupForm.email.toLowerCase())) {
        addToast("이미 존재하는 이메일 계정입니다.", "error");
        return;
      }

      const newUser = {
        role: signupForm.role,
        name: signupForm.name,
        email: signupForm.email,
        password: signupForm.password,
        phone: signupForm.phone || '010-0000-0000',
        sns: signupForm.sns || '미등록'
      };

      setRegisteredUsers([...registeredUsers, newUser]);
      setAuthInput({ email: newUser.email, password: newUser.password });
      setUserRole(newUser.role);
      
      addToast("회원가입이 완료되었습니다! 가입하신 정보로 바로 로그인하실 수 있습니다. [모의 모드]", "success");
      navigate('/login');
      
      setSignupForm({
        role: 'creator',
        name: '',
        email: '',
        password: '',
        phone: '',
        sns: ''
      });
    }
  };

  // Handle Logout Reset Flow
  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsGuestMode(false);
    setGoogleEmail('');
    setKakaoEmail('');
    setNaverEmail('');
    setAuthInput({ email: '', password: '' });
    setOtpCode(['', '', '', '', '', '']);
    setToken('');
    setIsOAuthCallbackMode(false);
    navigate('/');
    addToast("정상적으로 로그아웃되었습니다.", "success");
  };

  // Handle Notification Click Navigation Routing
  const handleNotificationClick = (notif) => {
    // Mark as read
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, unread: false } : n));
    setShowNotificationPanel(false);

    if (notif.type === 'match' || notif.type === 'chat') {
      navigate('/chat');
      if (notif.roomId) {
        setActiveChatId(notif.roomId);
        // Reset unread counts
        setChatRooms(prevRooms => prevRooms.map(r => r.id === notif.roomId ? { ...r, unread: 0 } : r));
      }
      addToast("해당 채팅방으로 연결되었습니다.", "success");
    } else if (notif.type === 'contract') {
      navigate('/contracts');
      addToast("계약서 조회 및 서명 화면으로 이동했습니다.", "success");
    } else {
      addToast("알림 조회가 완료되었습니다.", "info");
    }
  };

  return (
    <div className="app-container">
      {/* Toast Alert Notifications */}
      <ToastContainer toasts={toasts} />

      <Routes>
        {/* Unauthenticated Routes */}
        <Route path="/install" element={
          <InstallView 
            setIsInstallMode={setIsInstallMode} 
            addToast={addToast} 
          />
        } />
        
        <Route path="/oauth/callback" element={
          <OAuthCallback 
            API_BASE_URL={API_BASE_URL}
            setToken={setToken}
            setUserRole={setUserRole}
            setUserName={setUserName}
            setUserEmail={setUserEmail}
            setUserPhone={setUserPhone}
            setUserSns={setUserSns}
            setIsLoggedIn={setIsLoggedIn}
            setIsOAuthCallbackMode={setIsOAuthCallbackMode}
            addToast={addToast}
          />
        } />

        {/* Guest/Auth routes */}
        <Route path="/" element={
          isLoggedIn || isGuestMode ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LandingView 
              theme={theme}
              setTheme={setTheme}
              setIsGuestMode={setIsGuestMode}
              addToast={addToast}
            />
          )
        } />

        {/* Auth Forms Layout Group */}
        <Route element={
          isLoggedIn || isGuestMode ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <div className="auth-container" style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '24px', right: '24px', zIndex: 100 }}>
                <button 
                  type="button"
                  className="btn-icon" 
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  style={{ width: '44px', height: '44px', borderRadius: '50%', boxShadow: 'var(--shadow-glow)', cursor: 'pointer' }}
                  title={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
                >
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </div>
              
              <div className="auth-layout-wrapper">
                <div className="auth-card glass-card accent-indigo">
                  <div className="auth-header">
                    <div className="logo-icon">
                      <ShieldCheck size={20} />
                    </div>
                    <h2>AD-CONNECT</h2>
                    <p>크리에이터 데이터 광고 매칭 플랫폼</p>
                  </div>
                  <Outlet />
                </div>
              </div>
            </div>
          )
        }>
          <Route path="/login" element={
            <LoginView 
              authInput={authInput}
              setAuthInput={setAuthInput}
              handleLoginSubmit={handleLoginSubmit}
              setSignupForm={setSignupForm}
              addToast={addToast}
            />
          } />
          <Route path="/forgot" element={
            <ForgotPasswordView 
              addToast={addToast}
            />
          } />
          <Route path="/signup" element={
            <SignupView 
              signupForm={signupForm}
              setSignupForm={setSignupForm}
              handleSignupSubmit={handleSignupSubmit}
            />
          } />
          <Route path="/otp" element={
            <OtpVerifyView 
              otpCode={otpCode}
              setOtpCode={setOtpCode}
              handleOtpVerify={handleOtpVerify}
            />
          } />
        </Route>

        {/* Authenticated Dashboard Routes Layout Group */}
        <Route element={
          !isLoggedIn && !isGuestMode ? (
            <Navigate to="/" replace />
          ) : (
            <>
              {/* Main Layout */}
              <Sidebar 
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
                setShowNotificationPanel={setShowNotificationPanel}
                userRole={userRole}
                isGuestMode={isGuestMode}
                setIsGuestMode={setIsGuestMode}
                setIsLoggedIn={setIsLoggedIn}
                userName={userName}
                handleLogout={handleLogout}
              />

              <main className="main-content">
                <TopHeader 
                  mobileMenuOpen={mobileMenuOpen}
                  setMobileMenuOpen={setMobileMenuOpen}
                  wsStatus={wsStatus}
                  theme={theme}
                  setTheme={setTheme}
                  showNotificationPanel={showNotificationPanel}
                  setShowNotificationPanel={setShowNotificationPanel}
                  notifications={notifications}
                  setNotifications={setNotifications}
                  handleNotificationClick={handleNotificationClick}
                  addToast={addToast}
                />

                <Outlet />
              </main>

              {/* Toss Payments Gateway Simulator Modal */}
              {showPaymentModal && (
                <div className="payment-modal-overlay">
                  <div className="payment-modal">
                    <div className="payment-header">
                      <span className="payment-header-logo">toss payments</span>
                      <button onClick={() => setShowPaymentModal(false)} style={{ color: 'white', background: 'none', cursor: 'pointer' }}>
                        <X size={20} />
                      </button>
                    </div>

                    <div className="payment-body">
                      <div className="payment-amount-box">
                        <span className="payment-amount-label">Ad-Connect 안전 예치 대금 결제</span>
                        <div className="payment-amount-val">₩{paymentAmount} 원</div>
                      </div>

                      <div>
                        <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>결제 수단 선택</h4>
                        <div className="payment-method-selector">
                          <div 
                            className={`payment-method-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                            onClick={() => setPaymentMethod('card')}
                          >
                            신용/체크카드
                          </div>
                          <div 
                            className={`payment-method-btn ${paymentMethod === 'toss' ? 'active' : ''}`}
                            onClick={() => setPaymentMethod('toss')}
                          >
                            토스페이 (TossPay)
                          </div>
                        </div>
                      </div>

                      <div style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.4' }}>
                        본 결제는 테스트 및 시뮬레이션을 위한 가상 포트원 결제 게이트웨이 창입니다. 실제 대금이 청구되지 않고 플랫폼 안전 계약 체결 검증을 위한 모의 세션으로 동작합니다.
                      </div>

                      <button 
                        className="btn btn-primary" 
                        style={{ width: '100%', padding: '14px', background: '#1f8bfa', boxShadow: 'none' }}
                        onClick={executePayment}
                      >
                        안전 결제하기
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )
        }>
          <Route path="/dashboard" element={
            <DashboardView 
              ads={ads}
              analyticsTrend={ANALYTICS_TREND}
              analyticsRoi={ANALYTICS_ROI}
            />
          } />

          <Route path="/marketplace" element={
            <MarketplaceView 
              userRole={userRole}
              userName={userName}
              isGuestMode={isGuestMode}
              ads={ads}
              setAds={setAds}
              reports={reports}
              setReports={setReports}
              chatRooms={chatRooms}
              setChatRooms={setChatRooms}
              setActiveChatId={setActiveChatId}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterSubscriber={filterSubscriber}
              setFilterSubscriber={setFilterSubscriber}
              filterBudget={filterBudget}
              setFilterBudget={setFilterBudget}
              filterGenre={filterGenre}
              setFilterGenre={setFilterGenre}
              sortBy={sortBy}
              setSortBy={setSortBy}
              handleAddCampaign={handleAddCampaign}
              addToast={addToast}
              isBackendConnected={isBackendConnected}
              API_BASE_URL={API_BASE_URL}
              token={token}
            />
          } />

          <Route path="/portfolio" element={
            <PortfolioView 
              userName={userName}
              portfolioStats={portfolioStats}
              handleYoutubeSync={handleYoutubeSync}
              isSyncingYoutube={isSyncingYoutube}
              youtubeVideos={youtubeVideos}
            />
          } />

          <Route path="/chat" element={
            <ChatView 
              chatRooms={chatRooms}
              setChatRooms={setChatRooms}
              activeChatId={activeChatId}
              setActiveChatId={setActiveChatId}
              ads={ads}
              setPaymentAmount={setPaymentAmount}
              chatInputText={chatInputText}
              setChatInputText={setChatInputText}
              handleSendMessage={handleSendMessage}
              addToast={addToast}
            />
          } />

          <Route path="/contracts" element={
            <ContractsView 
              paymentAmount={paymentAmount}
              userRole={userRole}
              isGuestMode={isGuestMode}
              setShowPaymentModal={setShowPaymentModal}
              signedContract={signedContract}
              signatureSaved={signatureSaved}
              setSignatureSaved={setSignatureSaved}
              saveSignature={saveSignature}
              handleContractSubmit={handleContractSubmit}
              userName={userName}
              theme={theme}
              addToast={addToast}
            />
          } />

          <Route path="/admin" element={
            userRole === 'admin' ? (
              <AdminView 
                reports={reports}
                setReports={setReports}
                ads={ads}
                setAds={setAds}
                isGuestMode={isGuestMode}
                isBackendConnected={isBackendConnected}
                API_BASE_URL={API_BASE_URL}
                token={token}
                addToast={addToast}
              />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          } />

          <Route path="/mypage" element={
            <MyPageView 
              userRole={userRole}
              userName={userName}
              setUserName={setUserName}
              userEmail={userEmail}
              setUserEmail={setUserEmail}
              userPhone={userPhone}
              setUserPhone={setUserPhone}
              userSns={userSns}
              setUserSns={setUserSns}
              googleEmail={googleEmail}
              setGoogleEmail={setGoogleEmail}
              kakaoEmail={kakaoEmail}
              setKakaoEmail={setKakaoEmail}
              naverEmail={naverEmail}
              setNaverEmail={setNaverEmail}
              profileForm={profileForm}
              setProfileForm={setProfileForm}
              passwordForm={passwordForm}
              setPasswordForm={setPasswordForm}
              isWithdrawModalOpen={isWithdrawModalOpen}
              setIsWithdrawModalOpen={setIsWithdrawModalOpen}
              withdrawConfirmName={withdrawConfirmName}
              setWithdrawConfirmName={setWithdrawConfirmName}
              isGuestMode={isGuestMode}
              isBackendConnected={isBackendConnected}
              API_BASE_URL={API_BASE_URL}
              token={token}
              setToken={setToken}
              setAuthInput={setAuthInput}
              setOtpCode={setOtpCode}
              setIsLoggedIn={setIsLoggedIn}
              addToast={addToast}
            />
          } />
        </Route>

        {/* Wildcard Catchall */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
