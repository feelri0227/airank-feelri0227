const GlobalStyles = () => (
  <style>{`
    /* ── Google Fonts 로드 ── */
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
    @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

    /* ══════════════════════════════════════
       CSS 변수 - 라이트 테마 (기본)
       Sky Fresh 계열 (#f0f9ff)
       ══════════════════════════════════════ */
    :root {
      /* 배경 */
      --bg-primary: #f0f9ff;
      --bg-secondary: #ffffff;
      --bg-tertiary: #e0f2fe;
      --bg-card: #ffffff;
      --bg-card-hover: #f8fafc;
      --bg-nav: rgba(240, 249, 255, 0.92);

      /* 텍스트 */
      --text-primary: #0f172a;
      --text-secondary: #475569;
      --text-muted: #94a3b8;

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
      --shadow-card: 0 2px 12px rgba(0, 0, 0, 0.06);

      /* 블러/글로우 */
      --blob-opacity: 0.06;
      --noise-opacity: 0.04;

      /* 기타 */
      --ticker-bg: rgba(99, 102, 241, 0.04);
      --ticker-border: rgba(99, 102, 241, 0.12);
      --tag-bg: rgba(99, 102, 241, 0.08);
      --tag-color: #6366f1;
      --tag-border: rgba(99, 102, 241, 0.2);
      --modal-overlay: rgba(15, 23, 42, 0.5);
    }

    /* ══════════════════════════════════════
       CSS 변수 - 다크 테마
       #0f1420 기반
       ══════════════════════════════════════ */
    [data-theme="dark"] {
      --bg-primary: #0f1420;
      --bg-secondary: #151c2c;
      --bg-tertiary: #1a2235;
      --bg-card: #151c2c;
      --bg-card-hover: #1a2235;
      --bg-nav: rgba(15, 20, 32, 0.92);

      --text-primary: #e8ecf3;
      --text-secondary: #8492a6;
      --text-muted: #5a6478;

      --border-primary: rgba(255, 255, 255, 0.06);
      --border-hover: rgba(99, 102, 241, 0.4);

      --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.2);
      --shadow-md: 0 4px 20px rgba(0, 0, 0, 0.3);
      --shadow-lg: 0 12px 40px rgba(0, 0, 0, 0.4);
      --shadow-card: 0 2px 12px rgba(0, 0, 0, 0.2);

      --blob-opacity: 0.1;
      --noise-opacity: 0.3;

      --ticker-bg: rgba(6, 182, 212, 0.04);
      --ticker-border: rgba(6, 182, 212, 0.12);
      --tag-bg: rgba(99, 102, 241, 0.15);
      --tag-color: #818cf8;
      --tag-border: rgba(99, 102, 241, 0.3);
      --modal-overlay: rgba(0, 0, 0, 0.7);
    }

    /* ══════════════════════════════════════
       CSS 변수 - 마누스 테마
       딥 다크 + 웜 앰버 액센트
       ══════════════════════════════════════ */
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

    /* ══════════════════════════════════════
       CSS 변수 - 모노 테마
       순수 그레이스케일 + 흑백 느낌
       ══════════════════════════════════════ */
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
      --border-hover: rgba(255, 255, 255, 0.3);

      --accent-indigo: #cccccc;
      --accent-cyan: #888888;
      --accent-gradient: linear-gradient(135deg, #efefef, #888888);

      --color-green: #aaaaaa;
      --color-red: #dddddd;
      --color-gold: #bbbbbb;
      --color-silver: #888888;
      --color-bronze: #999999;

      --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
      --shadow-md: 0 4px 20px rgba(0, 0, 0, 0.4);
      --shadow-lg: 0 12px 40px rgba(0, 0, 0, 0.5);
      --shadow-card: 0 2px 12px rgba(0, 0, 0, 0.3);

      --blob-opacity: 0.07;
      --noise-opacity: 0.2;

      --ticker-bg: rgba(255, 255, 255, 0.03);
      --ticker-border: rgba(255, 255, 255, 0.08);
      --tag-bg: rgba(255, 255, 255, 0.08);
      --tag-color: #cccccc;
      --tag-border: rgba(255, 255, 255, 0.15);
      --modal-overlay: rgba(0, 0, 0, 0.7);
    }

    /* 모노 테마: 모든 이미지 흑백 */
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

    /* 스크롤바 스타일링 */
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

    /* 가로 스크롤 필터 행 */
    .filter-row {
      display: flex;
      gap: 6px;
      align-items: center;
      flex-wrap: wrap;
    }
    .filter-scroll {
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
      /* 네비 메뉴: 헤더 아래 가로 스크롤 */
      .navbar-header {
        flex-wrap: wrap !important;
        height: auto !important;
        padding: 8px 1rem !important;
        gap: 6px;
      }
      .navbar-nav {
        position: static !important;
        transform: none !important;
        order: 3;
        width: 100%;
        overflow-x: auto;
        flex-wrap: nowrap !important;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        padding-bottom: 2px;
      }
      .navbar-nav::-webkit-scrollbar { display: none; }

      /* 필터 행 가로 스크롤 */
      .filter-row {
        overflow-x: auto;
        flex-wrap: nowrap !important;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        padding-bottom: 4px;
      }
      .filter-row::-webkit-scrollbar { display: none; }
      .filter-scroll {
        overflow-x: auto;
        flex-wrap: nowrap !important;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
      }
      .filter-scroll::-webkit-scrollbar { display: none; }
    }

    /* ── 키프레임 애니메이션 ── */
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
