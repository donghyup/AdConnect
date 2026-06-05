import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  Megaphone,
  User,
  MessageSquare,
  FileSignature,
  ShieldAlert,
  Bell,
  Moon,
  Sun,
  Search,
  SlidersHorizontal,
  Filter,
  DollarSign,
  Users,
  Eye,
  TrendingUp,
  Send,
  Check,
  Play,
  FileText,
  CheckCircle2,
  AlertTriangle,
  X,
  LogOut,
  Upload,
  ShieldCheck,
  Award,
  Clock,
  ExternalLink,
  Lock,
  Mail,
  RefreshCw,
  Smartphone,
  QrCode,
  Download,
  Laptop
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

/* ==========================================================================
   Mock Data & Predefined Constants
   ========================================================================== */

// 1. Initial Campaign Ads
const INITIAL_ADS = [
  {
    id: 1,
    company: "네오스마트 (Neosmart)",
    title: "AI 기반 스마트 워치 신제품 리뷰 및 브랜디드 콘텐츠 캠페인",
    category: "테크/IT",
    budget: "3,500,000",
    subscribersRequired: "50,000+",
    status: "승인 완료", // 승인 대기, 승인 완료, 반려
    clicks: 1240,
    views: 45000,
    registrations: 340,
    duration: "2026-05-01 ~ 2026-06-01",
    description: "새롭게 출시되는 AI 탑재 스마트워치 '네오핏 Pro' 제품을 실제 착용하고 1주일간 경험한 장단점을 상세히 파헤쳐줄 크리에이터를 모십니다. 15분 내외의 영상 제작 및 고정 댓글 링크 삽입이 필요합니다.",
    genre: "테크",
    region: "서울/수도권",
    likes: 2450,
    comments: 312
  },
  {
    id: 2,
    company: "헬시푸드 코리아",
    title: "저당 다이어트 식단 패키지 PPL 광고 및 숏츠 브랜디드 광고",
    category: "뷰티/헬스",
    budget: "1,800,000",
    subscribersRequired: "10,000+",
    status: "승인 완료",
    clicks: 840,
    views: 28000,
    registrations: 190,
    duration: "2026-05-15 ~ 2026-06-15",
    description: "맛있게 즐기는 저당 식단 브랜드를 유튜브 숏츠(Shorts) 또는 메인 영상 내 PPL 형태로 소개해 주실 크리에이터를 찾습니다. 직접 시식하고 다이어트 전후 비교 등을 가볍게 브이로그에 녹여주실 분 선호합니다.",
    genre: "브이로그",
    region: "전국",
    likes: 1890,
    comments: 154
  },
  {
    id: 3,
    company: "플레이아레나",
    title: "신작 MMORPG '아스달 사가' 사전등록 및 초반 플레이 리뷰 가이드 캠페인",
    category: "게임",
    budget: "6,000,000",
    subscribersRequired: "100,000+",
    status: "승인 완료",
    clicks: 3100,
    views: 112000,
    registrations: 980,
    duration: "2026-05-20 ~ 2026-06-20",
    description: "올해 최대 기대작인 판타지 MMORPG 게임의 초반 성장 팁, 전직 리뷰, 그리고 매력 요소를 전달하는 동영상 마케팅입니다. 타겟 시청자 연령대가 2030 남성인 크리에이터분들의 많은 지원 바랍니다.",
    genre: "게임",
    region: "온라인",
    likes: 5400,
    comments: 890
  },
  {
    id: 4,
    company: "트래블메이트",
    title: "여름 휴가철 전용 초경량 캐리어 크라우드펀딩 바이럴 홍보 캠페인",
    category: "일상/여행",
    budget: "2,200,000",
    subscribersRequired: "30,000+",
    status: "승인 대기",
    clicks: 0,
    views: 0,
    registrations: 0,
    duration: "2026-06-01 ~ 2026-07-01",
    description: "깨지지 않고 2.1kg에 불과한 신개념 캐리어 크라우드펀딩 오픈 소식을 알리고, 여행지에서 짐을 싸는 현실적인 꿀팁과 함께 제품 노출을 해줄 여행 유튜버를 구합니다.",
    genre: "여행",
    region: "전국",
    likes: 0,
    comments: 0
  },
  {
    id: 5,
    company: "쿠킹클래스 랩",
    title: "[반려 유발] 초간단 밀키트 3종 홈쿡 레시피 대결 콘텐츠 제작 모집",
    category: "요리/푸드",
    budget: "2,500,000",
    subscribersRequired: "50,000+",
    status: "반려",
    clicks: 0,
    views: 0,
    registrations: 0,
    duration: "2026-05-01 ~ 2026-05-15",
    description: "특정 브랜드 푸드 키트를 활용해 5분 만에 레스토랑 퀄리티의 요리를 완성하는 스피드 레시피 대결 테마입니다. (사유: 사행성 요소 및 일부 자극적 표현 시정 요구)",
    genre: "요리",
    region: "온라인",
    likes: 0,
    comments: 0
  }
];

// 2. Charts Data (Ad Analytics)
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

// 3. Simulated Chat Rooms & Dialogues
const INITIAL_CHAT_ROOMS = [
  {
    id: 1,
    name: "네오스마트 (김민준 팀장)",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    lastMsg: "네, 크리에이터님! 제안해주신 스토리보드 기획안이 아주 만족스럽습니다.",
    time: "오전 11:20",
    unread: 2,
    online: true,
    messages: [
      { sender: 'them', text: '안녕하세요! 네오스마트 마케팅팀 김민준 팀장입니다. AI 스마트워치 광고 캠페인 매칭 축하드립니다.', time: '오전 10:15' },
      { sender: 'me', text: '감사합니다! 제품 강점인 AI 헬스케어 비서 기능을 일상 속 상황극에 녹여보려 하는데 의견이 어떠신가요?', time: '오전 10:30' },
      { sender: 'them', text: '기존의 뻔한 스펙 설명보다 상황극 형식이 훨씬 몰입도가 높을 것 같아 적극 찬성합니다!', time: '오전 10:45' },
      { sender: 'me', text: '그럼 상황 시나리오 및 스토리보드 작성해서 오늘 중으로 먼저 보내드리겠습니다.', time: '오전 11:00' },
      { sender: 'them', text: '네, 크리에이터님! 제안해주신 스토리보드 기획안이 아주 만족스럽습니다.', time: '오전 11:20' }
    ]
  },
  {
    id: 2,
    name: "플레이아레나 (이선우 본부장)",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    lastMsg: "계약서 초안을 업로드 해드렸으니 전자 서명 진행해 주시면 감사하겠습니다.",
    time: "어제",
    unread: 0,
    online: false,
    messages: [
      { sender: 'them', text: '안녕하세요 게임 크리에이터님! 신작 MMORPG 리뷰 광고 관련하여 대화 드립니다.', time: '어제 오후 2:00' },
      { sender: 'me', text: '반갑습니다 본부장님! 사전등록 유입 링크는 영상 본문과 고정댓글 두 곳 모두 적용하면 될까요?', time: '어제 오후 2:15' },
      { sender: 'them', text: '네, 정확합니다! 추가로 플레이 도중 사용할 수 있는 한정판 쿠폰코드 정보도 함께 삽입될 예정입니다.', time: '어제 오후 2:30' },
      { sender: 'them', text: '계약서 초안을 업로드 해드렸으니 전자 서명 진행해 주시면 감사하겠습니다.', time: '어제 오후 3:00' }
    ]
  }
];

// 4. Initial Notifications
const INITIAL_NOTIFICATIONS = [
  { id: 1, text: "'네오스마트' 광고 캠페인 매칭이 성사되었습니다. 채팅방에서 협업 논의를 시작하세요.", type: 'match', time: '5분 전', unread: true, roomId: 1 },
  { id: 2, text: "'플레이아레나' 신작 게임 캠페인 관련 신규 계약서 작성이 완료되었습니다. 서명이 필요합니다.", type: 'contract', time: '1시간 전', unread: true, roomId: 2 },
  { id: 3, text: "회원님의 포트폴리오 유튜브 구독자 수(124.5K) 동기화가 안전하게 완료되었습니다.", type: 'system', time: '3시간 전', unread: false },
  { id: 4, text: "지원하신 '다이어트 식단 패키지' 광고주가 회원님의 기획안 조회를 완료했습니다.", type: 'info', time: '어제', unread: false }
];

// 5. Admin Reports List
const INITIAL_REPORTS = [
  { id: 101, type: "스팸 광고", target: "초고수익 일 보장 (알바 모집 광고)", reporter: "user_creator_09", status: "대기 중", date: "2026-05-21" },
  { id: 102, type: "욕설/비방 댓글", target: "크리에이터 인신공격 악성 댓글 (캠페인 피드)", reporter: "advertiser_neo", status: "처리 완료", date: "2026-05-20" },
  { id: 103, type: "부적절 광고물", target: "검증되지 않은 다이어트 보조제 허위 과장 광고", reporter: "user_creator_99", status: "대기 중", date: "2026-05-19" }
];

// 6. Creator Portfolio Sync Info
const INITIAL_YOUTUBE_VIDEOS = [
  { id: "v1", title: "구독자 10만이 사용하는 극강의 웰메이드 스마트 생산성 템플릿 리뷰", views: "82,500회", likes: "3,400개", comments: "450개", duration: "12:45", image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=60" },
  { id: "v2", title: "인디 크리에이터로 살아남기 1년 차 회고와 플랫폼 비즈니스 팁", views: "43,100회", likes: "1,980개", comments: "210개", duration: "18:20", image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&auto=format&fit=crop&q=60" },
  { id: "v3", title: "내가 2026년에 맥북 에어를 팔고 다시 아이패드 프로로 돌아온 솔직한 이유", views: "128,000회", likes: "5,120개", comments: "620개", duration: "10:14", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=60" }
];

/* ==========================================================================
   Main Application Component
   ========================================================================== */

export default function App() {
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

  // Theme state
  const [theme, setTheme] = useState('dark');

  // Hybrid App download URL state (points to public/adconnect-release.apk)
  const [appDownloadUrl, setAppDownloadUrl] = useState(window.location.origin + '/adconnect-release.apk');
  const [iosDownloadUrl, setIosDownloadUrl] = useState(window.location.origin + '/api/manifest');

  // Install Mode state (triggered via ?mode=install search parameter)
  const [isInstallMode, setIsInstallMode] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'install') {
      setIsInstallMode(true);
    }
  }, []);

  // Backend Connection States
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');

  // Auth & Role state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authStep, setAuthStep] = useState('login'); // login | otp | forgot | signup
  const [authInput, setAuthInput] = useState({ email: 'j-creator@gmail.com', password: 'password123' });
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [userRole, setUserRole] = useState('creator'); // creator | advertiser | admin
  const [userName, setUserName] = useState('크리에이터 제이 (J)');
  const [userEmail, setUserEmail] = useState('j-creator@gmail.com');
  const [userPhone, setUserPhone] = useState('010-1234-5678');
  const [userSns, setUserSns] = useState('youtube.com/c/creator_j');

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
          const data = await response.json();
          setIsBackendConnected(true);
          setWsStatus(data.wsStatus || 'CONNECTED');
        } else {
          setIsBackendConnected(false);
          setWsStatus('DISCONNECTED');
        }
      } catch (err) {
        setIsBackendConnected(false);
        setWsStatus('DISCONNECTED');
      }
    };

    checkHeartbeat();
    const interval = setInterval(checkHeartbeat, 5000);
    return () => clearInterval(interval);
  }, []);

  // Dynamic user storage for signup simulation
  const [registeredUsers, setRegisteredUsers] = useState([
    {
      role: 'creator',
      name: '크리에이터 제이 (J)',
      email: 'j-creator@gmail.com',
      password: 'password123',
      phone: '010-1234-5678',
      sns: 'youtube.com/c/creator_j'
    },
    {
      role: 'advertiser',
      name: '네오스마트 (김민준 팀장)',
      email: 'mj.kim@neosmart.com',
      password: 'password123',
      phone: '02-555-9876',
      sns: 'neosmart.ai'
    },
    {
      role: 'admin',
      name: '최고 관리자 (Admin)',
      email: 'admin@ad-connect.com',
      password: 'password123',
      phone: '02-1234-5678',
      sns: 'ad-connect.com/admin'
    }
  ]);

  const [signupForm, setSignupForm] = useState({
    role: 'creator',
    name: '',
    email: '',
    password: '',
    phone: '',
    sns: ''
  });

  // Navigation
  const [currentView, setCurrentView] = useState('dashboard');
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

  // Fetch chat messages from backend when online and in chat view
  useEffect(() => {
    if (isBackendConnected && isLoggedIn && currentView === 'chat') {
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
  }, [isBackendConnected, isLoggedIn, activeChatId, currentView, token]);
  const [chatInputText, setChatInputText] = useState('');
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [toasts, setToasts] = useState([]);
  
  // Real-time WebSocket connection state simulation
  const [wsStatus, setWsStatus] = useState('CONNECTED');

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
  const sigCanvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

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

  // Handle auto-replies for chat simulation (Mock WebSocket STOMP reply)
  const handleSendMessage = async () => {
    if (!chatInputText.trim()) return;

    if (isBackendConnected) {
      try {
        const response = await fetch(`${API_BASE_URL}/chat/messages/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            roomId: activeChatId,
            sender: 'me',
            senderEmail: userEmail,
            text: chatInputText
          })
        });

        if (response.ok) {
          const savedMsg = await response.json();
          setChatInputText('');
          addToast("메시지가 전송되었습니다 (API 전송)", "success");
          
          setChatRooms(prevRooms =>
            prevRooms.map(room => {
              if (room.id === activeChatId) {
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

  // Sign drawing Canvas helpers
  const startDrawing = (e) => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

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
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

    ctx.lineTo(x, y);
    ctx.strokeStyle = theme === 'dark' ? '#1e293b' : '#1e293b';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureSaved(false);
  };

  const saveSignature = () => {
    setSignatureSaved(true);
    addToast("전자 서명이 안전하게 암호화(SHA-256) 저장되었습니다.", "success");
  };

  const handleContractSubmit = () => {
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
    setShowPaymentModal(false);
    addToast(`토스페이먼츠 ${paymentAmount}원 에스크로 결제가 무사히 완료되었습니다.`, "success");
    addToast("정산 안전 예치금으로 관리자 계좌에 보관 처리되었습니다.", "info");
    
    // Add campaign notification
    const notif = {
      id: Date.now(),
      text: `캠페인 예산 ${paymentAmount}원 결제가 완료되었습니다. 정산 보증금이 지급 대기 중입니다.`,
      type: 'match',
      time: '방금 전',
      unread: true
    };
    setNotifications(prev => [notif, ...prev]);
  };

  // Add a Campaign Ad (Advertiser View)
  const handleAddCampaign = async (e) => {
    e.preventDefault();
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
          setCurrentView('marketplace');
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
      setCurrentView('marketplace');
    }
  };

  // Filter Ads logic
  const filteredAds = ads.filter(ad => {
    // Role filter: Admins can see all, Creators/Advertisers see approved/pending accordingly
    if (userRole !== 'admin') {
      // Creator can see approved campaigns
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
          setAuthStep('otp');
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

      setAuthStep('otp');
      addToast("이메일로 6자리 2차 OTP 인증 번호가 발송되었습니다. [모의 모드]", "info");
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
          setAuthStep('login');
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
      setAuthStep('login');
      
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
    setAuthStep('login');
    setAuthInput({ email: '', password: '' });
    setOtpCode(['', '', '', '', '', '']);
    setToken('');
    setCurrentView('dashboard');
    addToast("정상적으로 로그아웃되었습니다.", "success");
  };

  // Handle Notification Click Navigation Routing
  const handleNotificationClick = (notif) => {
    // Mark as read
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, unread: false } : n));
    setShowNotificationPanel(false);

    if (notif.type === 'match' || notif.type === 'chat') {
      setCurrentView('chat');
      if (notif.roomId) {
        setActiveChatId(notif.roomId);
        // Reset unread counts
        setChatRooms(prevRooms => prevRooms.map(r => r.id === notif.roomId ? { ...r, unread: 0 } : r));
      }
      addToast("해당 채팅방으로 연결되었습니다.", "success");
    } else if (notif.type === 'contract') {
      setCurrentView('contracts');
      addToast("계약서 조회 및 서명 화면으로 이동했습니다.", "success");
    } else {
      addToast("알림 조회가 완료되었습니다.", "info");
    }
  };

  return (
    <div className="app-container">
      {/* Toast Alert Notifications */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            {toast.type === 'success' && <CheckCircle2 size={18} color="var(--secondary)" />}
            {toast.type === 'error' && <AlertTriangle size={18} color="var(--accent)" />}
            {toast.type === 'warning' && <AlertTriangle size={18} color="var(--warning)" />}
            {toast.type === 'info' && <Bell size={18} color="var(--primary)" />}
            <span style={{ fontSize: '13px', fontWeight: '500' }}>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* ==========================================================================
         A. LOGIN PAGE & AUTH FLOW
         ========================================================================== */}
      {isInstallMode ? (
        <div className="auth-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '24px', width: '100%' }}>
          <div className="auth-card glass-card accent-indigo" style={{ maxWidth: '600px', width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="auth-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px' }}>
              <div className="logo-icon">
                <Smartphone size={20} />
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '8px 0 0 0' }}>Ad-Connect 안심 설치 안내 센터</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: 0 }}>모바일 앱의 안전한 다운로드와 설치 과정을 돕는 페이지입니다.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {/* Android Download Column */}
              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Android APK
                </span>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', textAlign: 'center', margin: 0, minHeight: '32px' }}>안드로이드 스마트폰 전용 설치 파일</p>
                <a 
                  href={window.location.origin + '/adconnect-release.apk'}
                  download="adconnect-release.apk"
                  className="btn btn-success"
                  onClick={() => addToast("Android APK 다운로드가 시작되었습니다.", "success")}
                  style={{ width: '100%', fontSize: '12px', padding: '10px' }}
                >
                  <Download size={14} /> APK 다운로드
                </a>
              </div>

              {/* iOS Download Column */}
              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#6366f1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  iOS / iPhone
                </span>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', textAlign: 'center', margin: 0, minHeight: '32px' }}>아이폰 Safari 전용 무선 패키지 설치</p>
                <a 
                  href={`itms-services://?action=download-manifest&url=${encodeURIComponent(window.location.origin + '/api/manifest')}`}
                  className="btn btn-primary"
                  onClick={() => addToast("iOS 무선 설치가 시작되었습니다.", "info")}
                  style={{ width: '100%', fontSize: '12px', padding: '10px' }}
                >
                  <Play size={14} /> 무선 설치 (OTA)
                </a>
              </div>
            </div>

            {/* Step by Step troubleshooting guide */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertTriangle size={16} /> 🚨 필독! 설치 차단/악성앱 경고 해결 방법
              </span>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '8px' }}>
                  <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '2px' }}>1. 카카오톡/네이버 등의 인앱 브라우저 제한</strong>
                  QR 스캔 후 이 화면이 카카오톡이나 네이버 내부 브라우저에서 열려 있으면 파일 다운로드가 차단될 수 있습니다. 
                  우측 상단의 더보기(<span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>...</span>) 버튼을 눌러 <strong>[다른 브라우저로 열기]</strong> 또는 <strong>[Chrome으로 열기]</strong>를 선택해 주세요.
                </div>

                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '8px' }}>
                  <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '2px' }}>2. "유해한 파일일 수 있음" 경고 무시</strong>
                  구글 플레이스토어를 통하지 않은 모든 수동 설치 파일은 시스템이 경고를 띄웁니다. 본사 배포용 앱으로 안심하시고 <strong>[무시하고 다운로드]</strong> 또는 <strong>[그래도 다운로드]</strong>를 진행해 주세요.
                </div>

                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '8px' }}>
                  <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '2px' }}>3. "Play 프로텍트에 의해 차단됨" 팝업 해결</strong>
                  설치 시 구글 프로텍트 팝업이 뜨면 <strong>[확인]</strong> 대신 <strong>[세부정보 더보기]</strong>(또는 '자세히 보기') 화살표를 누르고, 아래에 작게 뜨는 <strong>[무시하고 설치]</strong>를 선택해 주세요.
                </div>

                <div>
                  <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '2px' }}>4. 설치 버튼이 작동 안 하거나 도중에 꺼지는 경우</strong>
                  모바일 금융 앱 백신(V3 Mobile Plus, 피싱아이즈 등)이 외부 APK의 설치 시도를 실시간으로 차단하여 튕기는 현상입니다. 백신 앱에서 실시간 탐지를 잠시 종료하거나 PC 원격제어 앱(TeamViewer 등)을 끄고 재시도해 주세요.
                </div>
              </div>
            </div>

            <button 
              className="btn btn-secondary"
              onClick={() => {
                setIsInstallMode(false);
                const url = new URL(window.location);
                url.searchParams.delete('mode');
                window.history.replaceState({}, document.title, url.pathname);
              }}
              style={{ width: '100%', fontSize: '13px' }}
            >
              Ad-Connect 웹 플랫폼 로그인으로 이동
            </button>
          </div>
        </div>
      ) : !isLoggedIn ? (
        <div className="auth-container">
          <div className="auth-layout-wrapper">
          <div className="auth-card glass-card accent-indigo">
            <div className="auth-header">
              <div className="logo-icon">
                <ShieldCheck size={20} />
              </div>
              <h2>AD-CONNECT</h2>
              <p>크리에이터 데이터 광고 매칭 플랫폼</p>
            </div>

            {authStep === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="contract-form">
                {/* Role pre-selection */}
                <div className="form-group">
                  <label>로그인 권한 역할 선택</label>
                  <div className="payment-method-selector">
                    <div 
                      className={`payment-method-btn ${userRole === 'creator' ? 'active' : ''}`}
                      onClick={() => handleRoleToggle('creator')}
                    >
                      크리에이터
                    </div>
                    <div 
                      className={`payment-method-btn ${userRole === 'advertiser' ? 'active' : ''}`}
                      onClick={() => handleRoleToggle('advertiser')}
                    >
                      광고주
                    </div>
                  </div>
                  <div 
                    className={`payment-method-btn ${userRole === 'admin' ? 'active' : ''}`}
                    onClick={() => handleRoleToggle('admin')}
                    style={{ marginTop: '8px', width: '100%' }}
                  >
                    플랫폼 최고 관리자 (Admin)
                  </div>
                </div>

                <div className="form-group">
                  <label>이메일 아이디</label>
                  <div className="search-input-wrapper">
                    <Mail size={16} className="search-icon" />
                    <input 
                      type="email" 
                      className="input-control" 
                      placeholder="name@ad-connect.com"
                      value={authInput.email}
                      onChange={e => setAuthInput({...authInput, email: e.target.value})}
                      required 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>비밀번호</label>
                  <div className="search-input-wrapper">
                    <Lock size={16} className="search-icon" />
                    <input 
                      type="password" 
                      className="input-control" 
                      placeholder="••••••••"
                      value={authInput.password}
                      onChange={e => setAuthInput({...authInput, password: e.target.value})}
                      required 
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  JWT 로그인 요청하기
                </button>

                <div className="auth-footer-links">
                  <span className="auth-link" onClick={() => addToast("가입하신 이메일은 가이드 메일 수신처 또는 데모용 계정을 참고하십시오.", "info")}>
                    아이디 찾기
                  </span>
                  <span className="auth-link-divider">|</span>
                  <span className="auth-link" onClick={() => setAuthStep('forgot')}>
                    비밀번호 찾기
                  </span>
                  <span className="auth-link-divider">|</span>
                  <span className="auth-link" onClick={() => {
                    setAuthStep('signup');
                    setSignupForm({
                      role: 'creator',
                      name: '',
                      email: '',
                      password: '',
                      phone: '',
                      sns: ''
                    });
                  }}>
                    회원가입
                  </span>
                </div>

                <div className="divider">소셜 계정 1초 로그인 연동</div>

                <div className="oauth-grid">
                  <div className="oauth-btn google" onClick={() => { setUserRole('creator'); setIsLoggedIn(true); addToast("Google OAuth 로그인 성공", "success"); }}>
                    <span style={{ fontSize: '16px', fontWeight: 'bold' }}>G</span>
                    Google
                  </div>
                  <div className="oauth-btn kakao" onClick={() => { setUserRole('creator'); setIsLoggedIn(true); addToast("카카오 OAuth 로그인 성공", "success"); }}>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#3c1e1e' }}>K</span>
                    Kakao
                  </div>
                  <div className="oauth-btn naver" onClick={() => { setUserRole('creator'); setIsLoggedIn(true); addToast("네이버 OAuth 로그인 성공", "success"); }}>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#03c75a' }}>N</span>
                    Naver
                  </div>
                </div>
              </form>
            ) : authStep === 'forgot' ? (
              <div className="contract-form">
                <h3>비밀번호 찾기 / 재설정</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: '8px 0 20px 0' }}>
                  가입하신 이메일 주소를 입력해 주시면 임시 비밀번호 발급 및 비밀번호 재설정 링크가 포함된 보안 인증 이메일을 발송해 드립니다.
                </p>
                <div className="form-group">
                  <label>가입된 이메일 주소</label>
                  <div className="search-input-wrapper">
                    <Mail size={16} className="search-icon" />
                    <input 
                      type="email" 
                      className="input-control" 
                      placeholder="name@ad-connect.com"
                      required 
                    />
                  </div>
                </div>
                <button 
                  className="btn btn-primary" 
                  style={{ width: '100%', marginTop: '12px' }}
                  onClick={() => {
                    addToast("비밀번호 재설정 보안 이메일이 무사히 발송되었습니다.", "success");
                    setAuthStep('login');
                  }}
                >
                  비밀번호 재설정 이메일 발송
                </button>
                <button 
                  className="btn btn-secondary" 
                  style={{ width: '100%', marginTop: '8px' }}
                  onClick={() => setAuthStep('login')}
                >
                  로그인 화면으로 돌아가기
                </button>
              </div>
            ) : authStep === 'signup' ? (
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
            ) : (
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
                          document.getElementById(`otp-${idx+1}`).focus();
                        }
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Backspace' && !otpCode[idx] && idx > 0) {
                          document.getElementById(`otp-${idx-1}`).focus();
                        }
                      }}
                    />
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                  <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setAuthStep('login')}>
                    이전으로
                  </button>
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleOtpVerify}>
                    최종 인증 완료
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 모바일 하이브리드 앱 다운로드 QR 코드 카드 */}
          <div className="auth-card glass-card accent-emerald" style={{ maxWidth: '420px', alignSelf: 'stretch' }}>
            <div className="auth-header">
              <div className="logo-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <Smartphone size={20} color="#10b981" />
              </div>
              <h2>모바일 앱 다운로드</h2>
              <p>로그인 없이 QR 코드로 즉시 다운로드 및 설치</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', justifyContent: 'center' }}>
              {/* Android APK */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', background: 'rgba(255, 255, 255, 0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div className="qr-image-container" style={{ width: '110px', height: '110px', padding: '6px', margin: 0, flexShrink: 0, position: 'relative' }}>
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(window.location.origin + '?mode=install')}`}
                    alt="Android APK QR Code"
                    className="qr-img-canvas"
                    style={{ width: '100%', height: '100%', display: 'block', background: 'white', borderRadius: '4px' }}
                  />
                  <div className="scan-laser-line" style={{ height: '2px' }}></div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Android APK
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    스캔하여 모바일 기기에서 안전 설치 가이드를 확인하고 앱을 설치합니다.
                  </span>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <a 
                      href={window.location.origin + '/adconnect-release.apk'}
                      download="adconnect-release.apk"
                      className="btn btn-secondary" 
                      style={{ 
                        fontSize: '11px', 
                        padding: '6px 12px', 
                        textDecoration: 'none', 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '4px',
                        width: 'fit-content'
                      }}
                    >
                      <Download size={12} />
                      APK 다운로드
                    </a>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setIsInstallMode(true)}
                      style={{ 
                        fontSize: '11px', 
                        padding: '6px 12px', 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '4px',
                        width: 'fit-content',
                        color: 'var(--primary)',
                        cursor: 'pointer'
                      }}
                    >
                      설치 오류 해결 가이드
                    </button>
                  </div>
                </div>
              </div>

              {/* iOS / iPhone */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', background: 'rgba(255, 255, 255, 0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div className="qr-image-container" style={{ width: '110px', height: '110px', padding: '6px', margin: 0, flexShrink: 0, position: 'relative' }}>
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(window.location.origin + '?mode=install')}`}
                    alt="iOS OTA QR Code"
                    className="qr-img-canvas"
                    style={{ width: '100%', height: '100%', display: 'block', background: 'white', borderRadius: '4px' }}
                  />
                  <div className="scan-laser-line" style={{ height: '2px' }}></div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#6366f1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    iOS / iPhone
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    스캔하여 모바일 기기에서 안전 설치 가이드를 확인하고 무선 설치를 진행합니다.
                  </span>
                  <a 
                    href={`itms-services://?action=download-manifest&url=${encodeURIComponent(window.location.origin + '/api/manifest')}`}
                    className="btn btn-secondary" 
                    style={{ 
                      fontSize: '11px', 
                      padding: '6px 12px', 
                      textDecoration: 'none', 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '4px',
                      width: 'fit-content'
                    }}
                  >
                    <Download size={12} />
                    무선 설치 (OTA)
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
        </div>
      ) : (
        /* ==========================================================================
           B. APPLICATION CONSOLE / MAIN VIEWS
           ========================================================================== */
        <>
          {/* 1. Sidebar Navigation */}
          <aside className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <div className="sidebar-logo">
              <div className="logo-icon">
                <Megaphone size={18} />
              </div>
              <h1>Ad-Connect</h1>
            </div>

            <div className="sidebar-menu">
              <div 
                className={`menu-item ${currentView === 'dashboard' ? 'active' : ''}`}
                onClick={() => { setCurrentView('dashboard'); setShowNotificationPanel(false); setMobileMenuOpen(false); }}
              >
                <LayoutDashboard size={18} />
                대시보드 성과 분석
              </div>

              <div 
                className={`menu-item ${currentView === 'marketplace' ? 'active' : ''}`}
                onClick={() => { setCurrentView('marketplace'); setShowNotificationPanel(false); setMobileMenuOpen(false); }}
              >
                <Megaphone size={18} />
                광고 매칭 보드
              </div>

              {userRole === 'creator' && (
                <div 
                  className={`menu-item ${currentView === 'portfolio' ? 'active' : ''}`}
                  onClick={() => { setCurrentView('portfolio'); setShowNotificationPanel(false); setMobileMenuOpen(false); }}
                >
                  <Award size={18} />
                  유튜브 포트폴리오
                </div>
              )}

              <div 
                className={`menu-item ${currentView === 'chat' ? 'active' : ''}`}
                onClick={() => { setCurrentView('chat'); setShowNotificationPanel(false); setMobileMenuOpen(false); }}
              >
                <MessageSquare size={18} />
                실시간 채팅방
              </div>

              <div 
                className={`menu-item ${currentView === 'contracts' ? 'active' : ''}`}
                onClick={() => { setCurrentView('contracts'); setShowNotificationPanel(false); setMobileMenuOpen(false); }}
              >
                <FileSignature size={18} />
                계약 및 정산 관리
              </div>

              {userRole === 'admin' && (
                <div 
                  className={`menu-item ${currentView === 'admin' ? 'active' : ''}`}
                  onClick={() => { setCurrentView('admin'); setShowNotificationPanel(false); setMobileMenuOpen(false); }}
                >
                  <ShieldAlert size={18} />
                  운영 어드민 센터
                </div>
              )}

              <div style={{ display: 'none' }}
                className={`menu-item ${currentView === 'appDownload' ? 'active' : ''}`}
                onClick={() => { setCurrentView('appDownload'); setShowNotificationPanel(false); setMobileMenuOpen(false); }}
              >
                <Smartphone size={18} />
                하이브리드 앱 다운로드
              </div>

              <div 
                className={`menu-item ${currentView === 'mypage' ? 'active' : ''}`}
                onClick={() => { setCurrentView('mypage'); setShowNotificationPanel(false); setMobileMenuOpen(false); }}
              >
                <User size={18} />
                마이페이지
              </div>

              <div 
                className="menu-item"
                onClick={handleLogout}
                style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '16px', color: 'var(--accent)' }}
              >
                <LogOut size={18} />
                로그아웃
              </div>
            </div>

            {/* Sidebar User Card with Role Changer for easy testing */}
            <div className="sidebar-footer">
              <div className="user-card" onClick={() => setCurrentView('mypage')} title="마이페이지 이동">
                <img 
                  src={
                    userRole === 'creator' 
                      ? "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80"
                      : userRole === 'advertiser'
                        ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                        : "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80"
                  } 
                  alt="avatar" 
                  className="user-avatar" 
                />
                <div className="user-info">
                  <div className="user-name">{userName}</div>
                  <div className="user-role" style={{ textTransform: 'uppercase', fontSize: '10px', color: 'var(--primary)' }}>
                    {userRole}
                  </div>
                </div>
                <div onClick={(e) => { e.stopPropagation(); handleLogout(); }} title="로그아웃">
                  <LogOut size={16} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
                </div>
              </div>
              <div style={{ marginTop: '8px', display: 'flex', gap: '4px' }}>
                <button 
                  onClick={() => handleRoleToggle('creator')} 
                  style={{ flex: 1, padding: '4px', fontSize: '9px', borderRadius: '4px', background: userRole === 'creator' ? 'var(--primary)' : 'rgba(255,255,255,0.05)', color: 'white' }}
                >
                  크리
                </button>
                <button 
                  onClick={() => handleRoleToggle('advertiser')} 
                  style={{ flex: 1, padding: '4px', fontSize: '9px', borderRadius: '4px', background: userRole === 'advertiser' ? 'var(--primary)' : 'rgba(255,255,255,0.05)', color: 'white' }}
                >
                  광고
                </button>
                <button 
                  onClick={() => handleRoleToggle('admin')} 
                  style={{ flex: 1, padding: '4px', fontSize: '9px', borderRadius: '4px', background: userRole === 'admin' ? 'var(--primary)' : 'rgba(255,255,255,0.05)', color: 'white' }}
                >
                  관리
                </button>
              </div>
            </div>
          </aside>

          {/* 2. Main Page Layout */}
          <main className="main-content">
            {/* Top Bar with real-time push controls */}
            <div className="top-header">
              <div className="header-left-group" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button 
                  className="mobile-toggle-btn"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  title="메뉴 열기"
                >
                  <SlidersHorizontal size={18} />
                </button>
                <div className="page-title">
                  <h2>
                    {currentView === 'dashboard' && '광고주 & 크리에이터 성과 분석'}
                    {currentView === 'marketplace' && '광고 매칭 스페이스'}
                    {currentView === 'portfolio' && '유튜브 API 포트폴리오 연동'}
                    {currentView === 'chat' && '협업 실시간 STOMP 메신저'}
                    {currentView === 'contracts' && '전자 계약 및 PortOne 결제 안전지대'}
                    {currentView === 'admin' && '부적절 광고 검수 및 스팸 신고 관리'}
                    {currentView === 'mypage' && '회원정보 관리 및 설정'}
                  </h2>
                  <p>실제 프로덕션 수준의 SaaS 아키텍처 및 무결성 제어</p>
                </div>
              </div>

              <div className="header-actions">
                {/* Mock connection state indicator */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', background: 'rgba(255,255,255,0.02)', padding: '6px 12px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                  <span className="active-dot" style={{ position: 'relative', display: 'inline-block', width: '8px', height: '8px' }}></span>
                  <span style={{ color: 'var(--text-secondary)' }}>WS:</span>
                  <span style={{ fontWeight: 'bold', color: 'var(--secondary)' }}>{wsStatus}</span>
                </div>

                {/* Theme toggle */}
                <button className="btn-icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                {/* Notifications bell */}
                <div className="notification-bell-container">
                  <button className="btn-icon" onClick={() => setShowNotificationPanel(!showNotificationPanel)}>
                    <Bell size={18} />
                    {notifications.filter(n => n.unread).length > 0 && (
                      <span className="notification-count">
                        {notifications.filter(n => n.unread).length}
                      </span>
                    )}
                  </button>

                  {showNotificationPanel && (
                    <div className="notification-panel">
                      <div className="notification-panel-header">
                        <span>실시간 통합 알림</span>
                        <button 
                          className="btn" 
                          style={{ padding: '2px 8px', fontSize: '11px' }} 
                          onClick={() => {
                            setNotifications(notifications.map(n => ({ ...n, unread: false })));
                            addToast("모든 알림을 읽음 처리했습니다.", "success");
                          }}
                        >
                          모두 읽음
                        </button>
                      </div>
                      <div className="notifications-list">
                        {notifications.length === 0 ? (
                          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                            새로운 알림이 없습니다.
                          </div>
                        ) : (
                          notifications.map(notif => (
                            <div 
                              key={notif.id} 
                              className={`notification-item ${notif.unread ? 'unread' : ''}`}
                              onClick={() => handleNotificationClick(notif)}
                              style={{ cursor: 'pointer' }}
                            >
                              <div className="notification-icon-wrapper" style={{ 
                                background: notif.type === 'match' ? 'rgba(16, 185, 129, 0.1)' : notif.type === 'contract' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                color: notif.type === 'match' ? 'var(--secondary)' : notif.type === 'contract' ? 'var(--primary)' : 'var(--warning)'
                              }}>
                                <Bell size={16} />
                              </div>
                              <div className="notification-content">
                                <p className="notification-text">{notif.text}</p>
                                <span className="notification-time">{notif.time}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ==========================================================================
               C. DYNAMIC MODULES BASED ON NAVIGATION
               ========================================================================== */}

            {/* MODULE 1: DASHBOARD (Recharts integration) */}
            {currentView === 'dashboard' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div className="kpi-grid">
                  <div className="glass-card kpi-card accent-indigo">
                    <div className="kpi-content">
                      <span className="kpi-label">누적 도달 조회수</span>
                      <span className="kpi-value">185,000회</span>
                      <span className="kpi-change up">▲ 24.3% 이번달</span>
                    </div>
                    <div className="kpi-icon indigo">
                      <Eye size={24} />
                    </div>
                  </div>

                  <div className="glass-card kpi-card accent-emerald">
                    <div className="kpi-content">
                      <span className="kpi-label">평균 매칭 클릭률 (CTR)</span>
                      <span className="kpi-value">5.20%</span>
                      <span className="kpi-change up">▲ 1.1% 지난주 대비</span>
                    </div>
                    <div className="kpi-icon emerald">
                      <TrendingUp size={24} />
                    </div>
                  </div>

                  <div className="glass-card kpi-card accent-rose">
                    <div className="kpi-content">
                      <span className="kpi-label">총 광고 예산 매출</span>
                      <span className="kpi-value">₩11.3M</span>
                      <span className="kpi-change up">▲ ₩3.2M 증가</span>
                    </div>
                    <div className="kpi-icon rose">
                      <DollarSign size={24} />
                    </div>
                  </div>

                  <div className="glass-card kpi-card accent-rose" style={{ borderLeft: '4px solid var(--warning)' }}>
                    <div className="kpi-content">
                      <span className="kpi-label">크리에이터 파트너</span>
                      <span className="kpi-value">124.5K</span>
                      <span className="kpi-change up">▲ 4,200명 증감</span>
                    </div>
                    <div className="kpi-icon indigo">
                      <Users size={24} />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '32px' }}>
                  <div className="glass-card">
                    <h3 style={{ marginBottom: '20px' }}>캠페인 실시간 성과 추이 (조회수 및 CTR 상관관계)</h3>
                    <div style={{ width: '100%', height: 320 }}>
                      <ResponsiveContainer>
                        <LineChart data={ANALYTICS_TREND} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                          <XAxis dataKey="name" stroke="var(--text-secondary)" />
                          <YAxis yAxisId="left" stroke="var(--primary)" />
                          <YAxis yAxisId="right" orientation="right" stroke="var(--secondary)" />
                          <Tooltip contentStyle={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
                          <Legend />
                          <Line yAxisId="left" type="monotone" dataKey="조회수" stroke="var(--primary)" strokeWidth={3} activeDot={{ r: 8 }} />
                          <Line yAxisId="right" type="monotone" dataKey="CTR" stroke="var(--secondary)" strokeWidth={3} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="glass-card">
                    <h3 style={{ marginBottom: '20px' }}>광고주별 예산 대비 광고 매출 성과 (ROI / Return On Investment)</h3>
                    <div style={{ width: '100%', height: 320 }}>
                      <ResponsiveContainer>
                        <BarChart data={ANALYTICS_ROI} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                          <XAxis dataKey="name" stroke="var(--text-secondary)" />
                          <YAxis stroke="var(--text-secondary)" />
                          <Tooltip contentStyle={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }} />
                          <Legend />
                          <Bar dataKey="예산" fill="rgba(99, 102, 241, 0.7)" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="매출" fill="rgba(16, 185, 129, 0.7)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="glass-card">
                  <h3 style={{ marginBottom: '16px' }}>크리에이터 캠페인 참여도 분석</h3>
                  <div className="admin-table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>캠페인 정보</th>
                          <th>평균 조회수</th>
                          <th>좋아요 참여율</th>
                          <th>댓글 반응도</th>
                          <th>추정 전환율(CVR)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ads.filter(a => a.status === '승인 완료').map(ad => (
                          <tr key={ad.id}>
                            <td style={{ fontWeight: 'bold' }}>{ad.title}</td>
                            <td>{ad.views.toLocaleString()}회</td>
                            <td>{((ad.likes / ad.views) * 100).toFixed(2)}%</td>
                            <td>{((ad.comments / ad.views) * 100).toFixed(2)}%</td>
                            <td><span className="badge badge-emerald">{(ad.id * 1.3).toFixed(1)}%</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 2: AD BOARD / MARKETPLACE (Advanced filter & Search) */}
            {currentView === 'marketplace' && (
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
            )}

            {/* MODULE 3: PORTFOLIO (YouTube API Mock integration) */}
            {currentView === 'portfolio' && (
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
            )}

            {/* MODULE 4: REAL-TIME CHAT (WebSocket simulator) */}
            {currentView === 'chat' && (
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
                    {/* Chat header */}
                    <div className="chat-header">
                      <div className="chat-header-user">
                        <img 
                          src={chatRooms.find(r => r.id === activeChatId)?.avatar} 
                          alt="user" 
                          className="user-avatar" 
                        />
                        <div>
                          <h4 style={{ fontSize: '15px' }}>{chatRooms.find(r => r.id === activeChatId)?.name}</h4>
                          <span style={{ fontSize: '11px', color: 'var(--secondary)' }}>
                            ● 실시간 STOMP 프로토콜 암호화 채널 연결 완료
                          </span>
                        </div>
                      </div>

                      <button 
                        className="btn btn-secondary"
                        style={{ padding: '8px 16px', fontSize: '12px' }}
                        onClick={() => {
                          const ad = ads.find(a => a.id === activeChatId);
                          if (ad) {
                            setPaymentAmount(ad.budget);
                          }
                          setCurrentView('contracts');
                          addToast("연계 계약서 작성 화면으로 이동합니다.", "info");
                        }}
                      >
                        계약 및 안전 결제 작성
                      </button>
                    </div>

                    {/* Chat Messages */}
                    <div className="chat-messages">
                      {chatRooms.find(r => r.id === activeChatId)?.messages.map((msg, i) => (
                        <div key={i} className={`chat-msg-bubble-wrapper ${msg.sender === 'me' ? 'sent' : 'received'}`}>
                          <div className="chat-msg-bubble">
                            {msg.text}
                          </div>
                          <span className="chat-msg-time">
                            {msg.time} {msg.sender === 'me' && <span style={{ color: 'var(--secondary)' }}><Check size={10} /> 읽음</span>}
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
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 5: CONTRACTS & PAYMENTS (E-Signature, PDF, Toss payment simulator) */}
            {currentView === 'contracts' && (
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
                              onClick={() => setShowPaymentModal(true)}
                            >
                              Toss Payments 보증금 결제
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Electronic Contract Sheet */}
                      <div className="contract-paper">
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
                            <button className="btn btn-secondary" onClick={clearSignature}>
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
            )}

            {/* MODULE 6: ADMIN (Reports & Ads review panel) */}
            {currentView === 'admin' && (
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
                              <span className={`badge ${report.type.includes('스팸') ? 'badge-warning' : 'badge-rose'}`}>
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
                                    onClick={() => {
                                      setReports(reports.map(r => r.id === report.id ? { ...r, status: '처리 완료' } : r));
                                      addToast("해당 신고 대상물 차단 및 영구 블락 조치가 완료되었습니다.", "success");
                                    }}
                                  >
                                    블랙리스트 조치
                                  </button>
                                  <button 
                                    className="btn btn-secondary" 
                                    style={{ padding: '6px 12px', fontSize: '11px' }}
                                    onClick={() => {
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
            )}

            {/* MODULE 7: MY PAGE (Profile change, password change, account withdrawal) */}
            {currentView === 'mypage' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div className="glass-card">
                  <div className="portfolio-header">
                    <img 
                      src={
                        userRole === 'creator' 
                          ? "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80"
                          : userRole === 'advertiser'
                            ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                            : "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80"
                      }
                      alt="creator" 
                      className="portfolio-avatar" 
                    />
                    <div className="portfolio-profile">
                      <span className="badge badge-indigo" style={{ textTransform: 'uppercase' }}>{userRole} 계정정보</span>
                      <h3 className="portfolio-name">{userName}</h3>
                      <p style={{ color: 'var(--text-secondary)' }}>이메일: {userEmail} | 연락처: {userPhone}</p>
                    </div>
                  </div>
                </div>

                <div className="mypage-grid">
                  {/* Left Column: Profile edit & Password edit */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {/* 1. 개인정보 변경 */}
                    <div className="glass-card accent-indigo">
                      <h3 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <User size={20} color="var(--primary)" />
                        개인정보 변경
                      </h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
                        플랫폼에서 사용되는 회원님의 프로필 이름 및 연락정보를 실시간으로 변경합니다.
                      </p>

                      <form 
                        className="contract-form"
                        onSubmit={async (e) => {
                          e.preventDefault();
                          if (isBackendConnected) {
                            try {
                              const response = await fetch(`${API_BASE_URL}/users/profile`, {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                  'Authorization': `Bearer ${token}`
                                },
                                body: JSON.stringify({
                                  email: userEmail,
                                  name: profileForm.name,
                                  phone: profileForm.phone,
                                  sns: profileForm.sns
                                })
                              });
                              const data = await response.json();
                              if (response.ok) {
                                setUserName(data.name);
                                setUserPhone(data.phone);
                                setUserSns(data.sns);
                                addToast(data.message || "개인정보가 성공적으로 변경되었습니다.", "success");
                              } else {
                                addToast(data.message || "개인정보 변경 실패", "error");
                              }
                            } catch (err) {
                              addToast("백엔드 통신 오류", "error");
                            }
                          } else {
                            setUserName(profileForm.name);
                            setUserEmail(profileForm.email);
                            setUserPhone(profileForm.phone);
                            setUserSns(profileForm.sns);
                            addToast("개인정보가 정상적으로 반영되었습니다. [모의 모드]", "success");
                          }
                        }}
                      >
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div className="form-group">
                            <label>사용자 이름 / 기업명</label>
                            <input 
                              type="text" 
                              className="input-control"
                              value={profileForm.name}
                              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                              required 
                            />
                          </div>
                          <div className="form-group">
                            <label>대표 이메일 주소</label>
                            <input 
                              type="email" 
                              className="input-control"
                              value={profileForm.email}
                              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                              required 
                            />
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div className="form-group">
                            <label>대표 연락처</label>
                            <input 
                              type="text" 
                              className="input-control"
                              value={profileForm.phone}
                              onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                              required 
                            />
                          </div>
                          <div className="form-group">
                            <label>SNS 채널 / 홈페이지 URL</label>
                            <input 
                              type="text" 
                              className="input-control"
                              value={profileForm.sns}
                              onChange={(e) => setProfileForm({ ...profileForm, sns: e.target.value })}
                              required 
                            />
                          </div>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
                          개인정보 저장하기
                        </button>
                      </form>
                    </div>

                    {/* 2. 비밀번호 변경 */}
                    <div className="glass-card">
                      <h3 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Lock size={20} color="var(--warning)" />
                        비밀번호 변경
                      </h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
                        계정 로그인을 위한 새로운 보안 비밀번호를 암호화하여 재설정합니다.
                      </p>

                      <form 
                        className="contract-form"
                        onSubmit={async (e) => {
                          e.preventDefault();
                          if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
                            addToast("모든 비밀번호 필드를 채워주세요.", "warning");
                            return;
                          }
                          if (passwordForm.new !== passwordForm.confirm) {
                            addToast("새 비밀번호와 확인 입력이 일치하지 않습니다.", "error");
                            return;
                          }

                          if (isBackendConnected) {
                            try {
                              const response = await fetch(`${API_BASE_URL}/users/password`, {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                  'Authorization': `Bearer ${token}`
                                },
                                body: JSON.stringify({
                                  email: userEmail,
                                  current: passwordForm.current,
                                  new: passwordForm.new
                                })
                              });
                              const data = await response.json();
                              if (response.ok) {
                                addToast(data.message || "비밀번호가 안전하게 변경되었습니다.", "success");
                                setPasswordForm({ current: '', new: '', confirm: '' });
                              } else {
                                addToast(data.message || "비밀번호 변경 실패", "error");
                              }
                            } catch (err) {
                              addToast("백엔드 통신 오류", "error");
                            }
                          } else {
                            addToast("비밀번호가 보안 알고리즘(SHA-256)을 거쳐 안전하게 업데이트되었습니다. [모의 모드]", "success");
                            setPasswordForm({ current: '', new: '', confirm: '' });
                          }
                        }}
                      >
                        <div className="form-group">
                          <label>현재 비밀번호</label>
                          <input 
                            type="password" 
                            className="input-control" 
                            placeholder="현재 비밀번호를 입력하세요"
                            value={passwordForm.current}
                            onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                            required
                          />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div className="form-group">
                            <label>새 비밀번호</label>
                            <input 
                              type="password" 
                              className="input-control" 
                              placeholder="새 비밀번호"
                              value={passwordForm.new}
                              onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label>새 비밀번호 확인</label>
                            <input 
                              type="password" 
                              className="input-control" 
                              placeholder="새 비밀번호 확인"
                              value={passwordForm.confirm}
                              onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                              required
                            />
                          </div>
                        </div>

                        <button type="submit" className="btn btn-secondary" style={{ width: '100%', marginTop: '8px' }}>
                          비밀번호 변경 완료
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Right Column: Danger Zone / Account Withdrawal */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div className="glass-card accent-rose">
                      <h3 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)' }}>
                        <AlertTriangle size={20} color="var(--accent)" />
                        위험구역 (Danger Zone)
                      </h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
                        계정 영구 탈퇴 및 데이터 완전 소멸 처리 구역입니다.
                      </p>

                      <div className="withdraw-box">
                        <h5>⚠️ 회원 탈퇴 시 주의사항</h5>
                        <ul>
                          <li>현재 매칭되어 진행 중인 광고 캠페인 계약이 즉각 중단 및 무효 처리됩니다.</li>
                          <li>안전거래 정산 에스크로에 예치된 보증금 잔액은 전액 소멸되어 복구되지 않습니다.</li>
                          <li>등록하신 유튜브 API 포트폴리오 연동 및 CTR 통계 데이터가 즉시 삭제됩니다.</li>
                        </ul>
                      </div>

                      {!isWithdrawModalOpen ? (
                        <button 
                          className="btn btn-danger" 
                          style={{ width: '100%', marginTop: '24px' }}
                          onClick={() => {
                            setIsWithdrawModalOpen(true);
                            setWithdrawConfirmName('');
                          }}
                        >
                          Ad-Connect 서비스 탈퇴 신청
                        </button>
                      ) : (
                        <div style={{ marginTop: '24px', background: 'rgba(244, 63, 94, 0.05)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
                          <p style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--accent)', marginBottom: '12px' }}>
                            본인 확인을 위해 아래의 닉네임 명칭을 똑같이 입력해주십시오:
                          </p>
                          <p style={{ fontSize: '15px', fontWeight: '800', textAlign: 'center', background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', margin: '8px 0 16px 0', letterSpacing: '0.05em' }}>
                            {userName}
                          </p>
                          <div className="form-group">
                            <input 
                              type="text" 
                              className="input-control" 
                              placeholder="닉네임명을 정확히 입력하세요"
                              value={withdrawConfirmName}
                              onChange={(e) => setWithdrawConfirmName(e.target.value)}
                              style={{ borderColor: withdrawConfirmName === userName ? 'var(--secondary)' : 'var(--accent)' }}
                            />
                          </div>
                          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                            <button 
                              className="btn btn-secondary" 
                              style={{ flex: 1 }} 
                              onClick={() => setIsWithdrawModalOpen(false)}
                            >
                              탈퇴 취소
                            </button>
                            <button 
                              className="btn btn-danger" 
                              style={{ flex: 1 }} 
                              disabled={withdrawConfirmName !== userName}
                              onClick={async () => {
                                if (isBackendConnected) {
                                  try {
                                    const response = await fetch(`${API_BASE_URL}/users/withdraw`, {
                                      method: 'POST',
                                      headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${token}`
                                      },
                                      body: JSON.stringify({
                                        email: userEmail,
                                        confirmName: withdrawConfirmName
                                      })
                                    });
                                    const data = await response.json();
                                    if (response.ok) {
                                      setIsLoggedIn(false);
                                      setAuthStep('login');
                                      setAuthInput({ email: '', password: '' });
                                      setOtpCode(['', '', '', '', '', '']);
                                      setToken('');
                                      setCurrentView('dashboard');
                                      setIsWithdrawModalOpen(false);
                                      addToast(data.message || "Ad-Connect 회원 탈퇴가 무사히 완료되었습니다.", "warning");
                                    } else {
                                      addToast(data.message || "회원 탈퇴 실패", "error");
                                    }
                                  } catch (err) {
                                    addToast("백엔드 통신 오류", "error");
                                  }
                                } else {
                                  setIsLoggedIn(false);
                                  setAuthStep('login');
                                  setAuthInput({ email: '', password: '' });
                                  setOtpCode(['', '', '', '', '', '']);
                                  setCurrentView('dashboard');
                                  setIsWithdrawModalOpen(false);
                                  addToast("Ad-Connect 회원 탈퇴가 안전하고 무사히 완료되었습니다. 이용해 주셔서 감사합니다. [모의 모드]", "warning");
                                }
                              }}
                            >
                              영구 탈퇴 승인
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 8: HYBRID APP DOWNLOAD CENTER */}
            {currentView === 'appDownload' && false && (
              <div className="app-download-container" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div className="glass-card accent-indigo">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                      <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Smartphone size={22} color="var(--primary)" />
                        하이브리드 앱 다운로드 및 배포 센터 (Android & iOS)
                      </h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
                        코르도바(Cordova) 및 Capacitor 환경으로 빌드된 하이브리드 패키지를 다운로드하거나, 설치용 QR 코드를 생성해 배포합니다.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="app-download-grid">
                  {/* Left Column: Build Pipeline & QR Settings */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    
                    {/* Dual OS QR Code & Configuration */}
                    <div className="glass-card">
                      <h4>설치용 QR 코드 발급기 (Dual OS 지원)</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '24px' }}>
                        각 배포 서버의 주소를 기입하면 사용자가 모바일에서 즉시 스캔하여 다운로드하거나 무선 설치할 수 있는 QR 코드가 동적으로 생성됩니다.
                      </p>

                      <div className="qr-section-layout" style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                        
                        {/* Android Column */}
                        <div className="qr-column" style={{ flex: 1, minWidth: '260px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                          <span style={{ fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981' }}>
                            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
                            Android (APK 직접 설치)
                          </span>
                          
                          <div className="qr-wrapper-card" style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div className="qr-image-container" style={{ margin: '0 auto', position: 'relative', padding: '12px', background: 'white', borderRadius: '8px' }}>
                              <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(appDownloadUrl)}`}
                                alt="Android APK QR Code"
                                style={{ display: 'block', width: '180px', height: '180px' }}
                              />
                            </div>
                            <span className="qr-scan-guide" style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                              기기 카메라 또는 QR 스캐너 앱으로 스캔
                            </span>
                          </div>

                          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div className="form-group">
                              <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>APK 배포 주소</label>
                              <input 
                                type="text" 
                                className="input-control"
                                value={appDownloadUrl}
                                onChange={(e) => setAppDownloadUrl(e.target.value)}
                                placeholder="http://192.168.0.1:3000/adconnect-release.apk"
                                style={{ fontSize: '12px' }}
                              />
                            </div>

                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button 
                                className="btn btn-secondary"
                                style={{ flex: 1, fontSize: '11px', padding: '6px 8px' }}
                                onClick={() => {
                                  const localIp = `http://192.168.0.15:3000/adconnect-release.apk`;
                                  setAppDownloadUrl(localIp);
                                  addToast("Android 개발용 로컬 주소로 설정되었습니다.", "info");
                                }}
                              >
                                로컬 IP 설정
                              </button>
                              <button 
                                className="btn btn-secondary"
                                style={{ flex: 1, fontSize: '11px', padding: '6px 8px' }}
                                onClick={() => {
                                  const prodUrl = `${window.location.origin}/adconnect-release.apk`;
                                  setAppDownloadUrl(prodUrl);
                                  addToast("Android 운영 서버 주소로 설정되었습니다.", "success");
                                }}
                              >
                                운영서버 설정
                              </button>
                            </div>

                            <button 
                              className="btn btn-primary" 
                              style={{ width: '100%', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none' }}
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = '/adconnect-release.apk';
                                link.download = 'adconnect-release.apk';
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                addToast("Android APK 파일 다운로드가 시작되었습니다.", "success");
                              }}
                            >
                              <Download size={14} style={{ marginRight: '6px' }} />
                              APK 직접 다운로드
                            </button>
                          </div>
                        </div>

                        {/* iOS Column */}
                        <div className="qr-column" style={{ flex: 1, minWidth: '260px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                          <span style={{ fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', color: '#6366f1' }}>
                            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#6366f1' }}></span>
                            iOS / iPhone (OTA 무선 설치)
                          </span>
                          
                          <div className="qr-wrapper-card" style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div className="qr-image-container" style={{ margin: '0 auto', position: 'relative', padding: '12px', background: 'white', borderRadius: '8px' }}>
                              <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`itms-services://?action=download-manifest&url=${iosDownloadUrl}`)}`}
                                alt="iOS OTA QR Code"
                                style={{ display: 'block', width: '180px', height: '180px' }}
                              />
                            </div>
                            <span className="qr-scan-guide" style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                              iOS Safari 기기 카메라로 스캔하여 즉시 설치
                            </span>
                          </div>

                          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div className="form-group">
                              <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>iOS manifest.plist 주소</label>
                              <input 
                                type="text" 
                                className="input-control"
                                value={iosDownloadUrl}
                                onChange={(e) => setIosDownloadUrl(e.target.value)}
                                placeholder="https://adconnect-hybrid.vercel.app/manifest.plist"
                                style={{ fontSize: '12px' }}
                              />
                            </div>

                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button 
                                className="btn btn-secondary"
                                style={{ flex: 1, fontSize: '11px', padding: '6px 8px' }}
                                onClick={() => {
                                  const localIp = `http://192.168.0.15:3000/manifest.plist`;
                                  setIosDownloadUrl(localIp);
                                  addToast("iOS 개발용 로컬 주소로 설정되었습니다.", "info");
                                }}
                              >
                                로컬 IP 설정
                              </button>
                              <button 
                                className="btn btn-secondary"
                                style={{ flex: 1, fontSize: '11px', padding: '6px 8px' }}
                                onClick={() => {
                                  const prodUrl = `${window.location.origin}/manifest.plist`;
                                  setIosDownloadUrl(prodUrl);
                                  addToast("iOS 운영 서버 주소로 설정되었습니다.", "success");
                                }}
                              >
                                운영서버 설정
                              </button>
                            </div>

                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button 
                                className="btn btn-primary" 
                                style={{ flex: 2, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none' }}
                                onClick={() => {
                                  window.location.href = `itms-services://?action=download-manifest&url=${encodeURIComponent(iosDownloadUrl)}`;
                                  addToast("iOS OTA 설치 요청이 전송되었습니다.", "info");
                                }}
                              >
                                <Play size={14} style={{ marginRight: '6px' }} />
                                무선 설치
                              </button>
                              <button 
                                className="btn btn-secondary" 
                                style={{ flex: 1 }}
                                onClick={() => {
                                  const link = document.createElement('a');
                                  link.href = '/adconnect-release.ipa';
                                  link.download = 'adconnect-release.ipa';
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                  addToast("iOS IPA 파일 다운로드가 시작되었습니다.", "success");
                                }}
                                title="IPA 파일 직접 다운로드"
                              >
                                <Download size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Restore Default Button */}
                      <button 
                        className="btn btn-secondary"
                        style={{ width: '100%', marginTop: '20px' }}
                        onClick={() => {
                          const origin = window.location.origin;
                          setAppDownloadUrl(origin + '/adconnect-release.apk');
                          setIosDownloadUrl(origin + '/api/manifest');
                          addToast("다운로드 및 OTA Manifest 주소가 현재 접속 도메인으로 복원되었습니다.", "success");
                        }}
                      >
                        <RefreshCw size={14} style={{ marginRight: '6px' }} />
                        현재 도메인 주소로 자동 동기화
                      </button>
                    </div>

                    {/* PWA (Progressive Web App) Guide Card */}
                    <div className="glass-card accent-indigo" style={{ padding: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                        <Smartphone size={24} color="var(--primary)" />
                        <h4 style={{ margin: 0 }}>PWA(Progressive Web App) 무설치 즉시 앱 사용 가이드</h4>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px', lineHeight: '1.6' }}>
                        스토어나 개발자 서명 제약 없이, 모바일 브라우저의 PWA 기술을 활용해 홈 화면에 네이티브 앱처럼 아이콘을 추가하고 오프라인에서도 완전하게 구동할 수 있습니다.
                      </p>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#6366f1', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                            iOS / iPhone 에서 홈 화면 추가
                          </span>
                          <ol style={{ fontSize: '12px', color: 'var(--text-secondary)', paddingLeft: '16px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <li>Safari 브라우저를 켜고 본 서비스 주소에 접속합니다.</li>
                            <li>Safari 하단 중앙 of <strong>[공유]</strong> 버튼(네모 위 화살표 모양)을 터치합니다.</li>
                            <li>목록을 아래로 스크롤하여 <strong>[홈 화면에 추가]</strong> 메뉴를 선택합니다.</li>
                            <li>홈 화면에 생성된 <strong>Ad-Connect</strong> 아이콘을 눌러 전체화면 앱으로 시작합니다.</li>
                          </ol>
                        </div>

                        <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                            Android / Samsung 에서 홈 화면 추가
                          </span>
                          <ol style={{ fontSize: '12px', color: 'var(--text-secondary)', paddingLeft: '16px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <li>Chrome 브라우저를 통해 본 서비스 주소에 접속합니다.</li>
                            <li>주소창 우측 또는 하단 메뉴의 <strong>[옵션 더보기]</strong>(점 3개)를 터치합니다.</li>
                            <li><strong>[앱 설치]</strong> 또는 <strong>[홈 화면에 추가]</strong> 버튼을 선택합니다.</li>
                            <li>화면 안내에 따라 설치 버튼을 누르면 바탕 화면에 앱 아이콘이 추가됩니다.</li>
                          </ol>
                        </div>
                      </div>
                    </div>

                    {/* Stepper Pipeline Description */}
                    <div className="glass-card">
                      <h4>하이브리드 앱 빌드 & 배포 파이프라인</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '24px' }}>
                        반응형 웹앱 소스로부터 APK 및 iOS 패키징, 서명 및 무선 배포까지 적용하는 표준 프로세스입니다.
                      </p>

                      <div className="stepper-pipeline">
                        <div className="step-item">
                          <div className="step-badge">1</div>
                          <div className="step-content">
                            <span className="step-title">반응형 웹앱 빌드 (Build Frontend)</span>
                            <span className="step-desc">Vite와 React 환경에서 웹 최적화 자산을 빌드합니다.</span>
                            <code className="step-code">npm run build</code>
                          </div>
                        </div>

                        <div className="step-item">
                          <div className="step-badge">2</div>
                          <div className="step-content">
                            <span className="step-title">하이브리드 컨테이너 래핑 (Cordova/Capacitor)</span>
                            <span className="step-desc">네이티브 쉘을 추가하고 빌드된 웹 파일들을 컨테이너 디렉토리로 동기화합니다.</span>
                            <code className="step-code">cordova platform add android ios / npx cap add android ios</code>
                          </div>
                        </div>

                        <div className="step-item">
                          <div className="step-badge">3</div>
                          <div className="step-content">
                            <span className="step-title">패키징 및 릴리즈 서명 (Sign APK & IPA)</span>
                            <span className="step-desc">각 플랫폼 SDK를 구동해 빌드하고 Android Keystore 및 Apple 배포 인증서로 서명을 마칩니다.</span>
                            <code className="step-code">cordova build android --release / cordova build ios --release</code>
                          </div>
                        </div>

                        <div className="step-item">
                          <div className="step-badge">4</div>
                          <div className="step-content">
                            <span className="step-title">배포 서버 업로드 & QR 설치 (QR Distribution)</span>
                            <span className="step-desc">서명된 APK와 IPA 파일을 서버에 업로드한 뒤, Android/iOS 전용 QR 코드 및 OTA(Over-The-Air) 스펙을 통해 사용자가 다운로드할 수 있게 배포합니다.</span>
                            <span className="step-badge-status">완료 (상단의 QR 코드 스캔 가능)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Phone Screen Live Simulator */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <h4 style={{ alignSelf: 'flex-start', marginBottom: '8px' }}>모바일 앱 미리보기</h4>
                      <p style={{ alignSelf: 'flex-start', color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '24px' }}>
                        하이브리드 Cordova/Capacitor 컨테이너 내부 및 PWA 전체화면 모드에서 실행되는 Ad-Connect 모바일 반응형 뷰포트 레이아웃입니다.
                      </p>

                      {/* Smartphone simulator frame */}
                      <div className="phone-simulator-frame">
                        <div className="phone-earpiece"></div>
                        <div className="phone-camera"></div>
                        <div className="phone-screen-container">
                          <div className="phone-status-bar">
                            <span>14:20</span>
                            <div className="phone-status-icons">
                              <span>LTE</span>
                              <span>98%</span>
                            </div>
                          </div>
                          
                          {/* Mini Responsive App Content */}
                          <div className="phone-mock-app">
                            <div className="mock-app-header">
                              <span style={{ fontSize: '11px', fontWeight: 'bold' }}>AD-CONNECT MOBILE</span>
                              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--secondary)' }}></div>
                            </div>
                            
                            <div className="mock-app-body">
                              <div className="mock-widget">
                                <span className="mock-widget-title">누적 도달수</span>
                                <span className="mock-widget-val">185,000회</span>
                              </div>

                              <div className="mock-widget">
                                <span className="mock-widget-title">평균 클릭률 (CTR)</span>
                                <span className="mock-widget-val" style={{ color: 'var(--secondary)' }}>5.20%</span>
                              </div>

                              <div className="mock-widget">
                                <span className="mock-widget-title">매칭 진행 캠페인</span>
                                <span className="mock-widget-val" style={{ color: 'var(--primary)' }}>3건</span>
                              </div>

                              {/* Mini Chart Mockup */}
                              <div className="mock-chart-container">
                                <span className="mock-widget-title" style={{ marginBottom: '6px', display: 'block' }}>최근 트래픽 추이</span>
                                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '40px', paddingTop: '10px' }}>
                                  <div style={{ width: '12%', height: '30%', background: 'var(--primary)', borderRadius: '2px' }}></div>
                                  <div style={{ width: '12%', height: '50%', background: 'var(--primary)', borderRadius: '2px' }}></div>
                                  <div style={{ width: '12%', height: '45%', background: 'var(--primary)', borderRadius: '2px' }}></div>
                                  <div style={{ width: '12%', height: '70%', background: 'var(--primary)', borderRadius: '2px' }}></div>
                                  <div style={{ width: '12%', height: '60%', background: 'var(--primary)', borderRadius: '2px' }}></div>
                                  <div style={{ width: '12%', height: '90%', background: 'var(--secondary)', borderRadius: '2px' }}></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="phone-home-bar"></div>
                      </div>

                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '16px', textAlign: 'center' }}>
                        * 이 시뮬레이터는 디바이스 크기 360x740 화소 기준 모바일 환경 뷰포트 레이아웃입니다.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>

          {/* ==========================================================================
             D. MODAL DIALOGS (Toss Payments Simulator)
             ========================================================================== */}
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
      )}
    </div>
  );
}
