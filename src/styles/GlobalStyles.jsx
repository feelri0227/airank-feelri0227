const GlobalStyles = () => (
  <style>{`
    /* ── Google Fonts 로드 ── */
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
    @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

    /* ... (기존 테마 변수들은 동일) ... */

    :root {
      /* 배경 */
      --bg-primary: #fafafa;
      --bg-secondary: #ffffff;
      --bg-tertiary: #f0f0f0;
      --bg-card: #ffffff;
      --bg-card-hover: #f7f7f7;
      --bg-nav: rgba(250, 250, 250, 0.94);

      /* 텍스트 */
      --text-primary: #111111;
      --text-secondary: #555555;
      --text-muted: #999999;

      /* 보더 */
      --border-primary: rgba(0, 0, 0, 0.08);
      --border-hover: rgba(99, 102, 241, 0.3);

      /* 액센트 - 인디고 + 시안 */
      --accent-indigo: #6366f1;
      --accent-cyan: #06b6d4;
      --accent-gradient: linear-gradient(135deg, #6366f1, #06b6d4);

      /* 상태 색상 */
      --color-green: #22c55e;
      --color-red: #ef4444;
      --color-gold: #f59e0b;
      --color-silver: #94a3b8;
      --color-bronze: #d97706;

      /* 그림자 */
      --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.06);
      --shadow-md: 0 4px 20px rgba(0, 0, 0, 0.08);
      --shadow-lg: 0 12px 40px rgba(0, 0, 0, 0.12);
      --shadow-card: 0 2px 8px rgba(0, 0, 0, 0.06);

      /* 블러/글로우 */
      --blob-opacity: 0.05;
      --noise-opacity: 0.03;

      /* 기타 */
      --ticker-bg: rgba(99, 102, 241, 0.04);
      --ticker-border: rgba(99, 102, 241, 0.12);
      --tag-bg: rgba(99, 102, 241, 0.08);
      --tag-color: #6366f1;
      --tag-border: rgba(99, 102, 241, 0.2);
      --modal-overlay: rgba(0, 0, 0, 0.4);
    }

    [data-theme="dark"] {
      --bg-primary: #0a0a0a;
      --bg-secondary: #111111;
      --bg-tertiary: #1a1a1a;
      --bg-card: #111111;
      --bg-card-hover: #1a1a1a;
      --bg-nav: rgba(10, 10, 10, 0.94);

      --text-primary: #f0f0f0;
      --text-secondary: #888888;
      --text-muted: #505050;

      --border-primary: rgba(255, 255, 255, 0.07);
      --border-hover: rgba(99, 102, 241, 0.4);

      --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
      --shadow-md: 0 4px 20px rgba(0, 0, 0, 0.5);
      --shadow-lg: 0 12px 40px rgba(0, 0, 0, 0.6);
      --shadow-card: 0 2px 12px rgba(0, 0, 0, 0.4);

      --blob-opacity: 0.12;
      --noise-opacity: 0.3;

      --ticker-bg: rgba(6, 182, 212, 0.04);
      --ticker-border: rgba(6, 182, 212, 0.12);
      --tag-bg: rgba(99, 102, 241, 0.15);
      --tag-color: #818cf8;
      --tag-border: rgba(99, 102, 241, 0.3);
      --modal-overlay: rgba(0, 0, 0, 0.8);
    }

    [data-theme="manus"] {
      --bg-primary: #0c0c0c;
      --bg-secondary: #141414;
      --bg-tertiary: #1c1c1c;
      --bg-card: #141414;
      --bg-card-hover: #1c1c1c;
      --bg-nav: rgba(12, 12, 12, 0.94);

      --text-primary: #fafaf9;
      --text-secondary: #a8a29e;
      --text-muted: #57534e;

      --border-primary: rgba(255, 255, 255, 0.06);
      --border-hover: rgba(245, 158, 11, 0.4);

      --accent-indigo: #f59e0b;
      --accent-cyan: #fb923c;
      --accent-gradient: linear-gradient(135deg, #f59e0b, #fb923c);

      --color-green: #4ade80;
      --color-red: #f87171;
      --color-gold: #fbbf24;
      --color-silver: #a8a29e;
      --color-bronze: #f97316;

      --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.4);
      --shadow-md: 0 4px 20px rgba(0, 0, 0, 0.5);
      --shadow-lg: 0 12px 40px rgba(0, 0, 0, 0.6);
      --shadow-card: 0 2px 12px rgba(0, 0, 0, 0.4);

      --blob-opacity: 0.08;
      --noise-opacity: 0.25;

      --ticker-bg: rgba(245, 158, 11, 0.05);
      --ticker-border: rgba(245, 158, 11, 0.15);
      --tag-bg: rgba(245, 158, 11, 0.1);
      --tag-color: #fbbf24;
      --tag-border: rgba(245, 158, 11, 0.25);
      --modal-overlay: rgba(0, 0, 0, 0.8);
    }
    [data-theme="mono"] {
      --bg-primary: #1c1c1c;
      --bg-secondary: #242424;
      --bg-tertiary: #2e2e2e;
      --bg-card: #242424;
      --bg-card-hover: #2e2e2e;
      --bg-nav: rgba(28, 28, 28, 0.94);

      --text-primary: #efefef;
      --text-secondary: #a0a0a0;
      --text-muted: #606060;

      --border-primary: rgba(255, 255, 255, 0.08);
      --border-hover: rgba(255, 255, 255, 0.25);

      --accent-indigo: #c0c0c0;
      --accent-cyan: #808080;
      --accent-gradient: linear-gradient(135deg, #e0e0e0, #707070);

      --color-green: #9a9a9a;
      --color-red: #c0c0c0;
      --color-gold: #b0b0b0;
      --color-silver: #787878;
      --color-bronze: #909090;

      --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
      --shadow-md: 0 4px 20px rgba(0, 0, 0, 0.4);
      --shadow-lg: 0 12px 40px rgba(0, 0, 0, 0.5);
      --shadow-card: 0 2px 12px rgba(0, 0, 0, 0.3);

      --blob-opacity: 0.06;
      --noise-opacity: 0.2;

      --ticker-bg: rgba(255, 255, 255, 0.03);
      --ticker-border: rgba(255, 255, 255, 0.08);
      --tag-bg: rgba(255, 255, 255, 0.08);
      --tag-color: #b0b0b0;
      --tag-border: rgba(255, 255, 255, 0.12);
      --modal-overlay: rgba(0, 0, 0, 0.7);
    }

    [data-theme="mono"] img {
      filter: grayscale(100%);
      transition: filter 0.3s ease;
    }

    /* ── 기본 리셋 & 글로벌 ── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Pretendard', -apple-system, sans-serif;
      background: var(--bg-primary);
      color: var(--text-primary);
      transition: background 0.35s ease, color 0.35s ease;
    }

    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--text-muted); border-radius: 3px; }

    /* ── 반응형 레이아웃 ── */
    .main-grid {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 20px;
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }
    .navbar-nav { display: flex; }
    .navbar-login { display: block; }

    .filter-row, .filter-scroll {
      display: flex;
      gap: 6px;
      align-items: center;
      flex-wrap: wrap;
    }

    .sidebar-left, .sidebar-right {
      position: sticky;
      top: 80px;
      align-self: start;
    }

    @media (max-width: 1100px) {
      .main-grid { grid-template-columns: 1fr !important; }
      .sidebar-right { display: none !important; }
    }

    @media (max-width: 768px) {
      /* 네비게이션 바 모바일 최적화 */
      .navbar-header {
        flex-wrap: nowrap !important; /* 줄바꿈 방지 */
        overflow-x: auto !important; /* 가로 스크롤 허용 */
        height: 64px !important; /* 높이 고정 */
        padding: 0 1rem !important;
      }
      .navbar-header::-webkit-scrollbar { display: none; } /* 스크롤바 숨김 */

      .navbar-nav {
        position: static !important;
        transform: none !important;
        order: 2; /* 로고 다음에 바로 오도록 순서 조정 */
        width: auto;
        flex-shrink: 0; /* 메뉴 너비가 줄어들지 않도록 설정 */
      }

      /* 필터 행 가로 스크롤 */
      .filter-row, .filter-scroll {
        overflow-x: auto;
        flex-wrap: nowrap !important;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        padding-bottom: 4px;
      }
      .filter-row::-webkit-scrollbar, .filter-scroll::-webkit-scrollbar { display: none; }
    }

    /* ── 키프레임 애니메이션 ── */
    /* ... (애니메이션은 동일) ... */
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    @keyframes tickerScroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    @keyframes shimmer {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-6px); }
    }
  `}</style>
);

export default GlobalStyles;
