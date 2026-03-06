const GlobalStyles = () => (
  <style>{`
    /* ── Google Fonts 로드 ── */
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
    @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
    @import url('https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&display=swap');

    :root {
      --bg-primary: #fafafa;
      --bg-secondary: #ffffff;
      --bg-tertiary: #f0f0f0;
      --bg-card: #ffffff;
      --bg-card-hover: #f7f7f7;
      --bg-nav: rgba(250, 250, 250, 0.94);
      --text-primary: #111111;
      --text-secondary: #555555;
      --text-muted: #999999;
      --border-primary: rgba(0, 0, 0, 0.08);
      --border-hover: rgba(99, 102, 241, 0.3);
      --accent-indigo: #6366f1;
      --accent-cyan: #06b6d4;
      --accent-gradient: linear-gradient(135deg, #6366f1, #06b6d4);
      --color-green: #22c55e;
      --color-red: #ef4444;
      --color-gold: #f59e0b;
      --color-silver: #94a3b8;
      --color-bronze: #d97706;
      --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.06);
      --shadow-md: 0 4px 20px rgba(0, 0, 0, 0.08);
      --shadow-lg: 0 12px 40px rgba(0, 0, 0, 0.12);
      --shadow-card: 0 2px 8px rgba(0, 0, 0, 0.06);
      --blob-opacity: 0.05;
      --noise-opacity: 0.03;
      --ticker-bg: rgba(99, 102, 241, 0.04);
      --ticker-border: rgba(99, 102, 241, 0.12);
      --tag-bg: rgba(99, 102, 241, 0.08);
      --tag-color: #6366f1;
      --tag-border: rgba(99, 102, 241, 0.2);
      --modal-overlay: rgba(0, 0, 0, 0.4);
      --font-main: 'Pretendard', -apple-system, sans-serif;
      --font-title: 'Outfit', sans-serif;
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

    /* ── 조선 머슴 테마 (chosun) ── */
    [data-theme="chosun"] {
      --bg-primary: #f4f1ea;       /* 한지색 */
      --bg-secondary: #fff8e7;     /* 연한 미색 */
      --bg-tertiary: #e8e4d8;
      --bg-card: #fff8e7;
      --bg-card-hover: #fcf4dd;
      --bg-nav: rgba(244, 241, 234, 0.94);
      
      --text-primary: #2c2c2c;     /* 먹색 */
      --text-secondary: #4e342e;   /* 진한 나무색 */
      --text-muted: #8d6e63;
      
      --border-primary: rgba(78, 52, 46, 0.15);
      --border-hover: #a1887f;
      
      --accent-indigo: #8d6e63;    /* 엽전색 계열로 대체 */
      --accent-cyan: #bcaaa4;
      --accent-gradient: linear-gradient(135deg, #a1887f, #d7ccc8);
      
      --color-gold: #d4af37;
      --color-silver: #a8a8a8;
      --color-bronze: #cd7f32;
      
      --shadow-sm: 0 1px 3px rgba(78, 52, 46, 0.1);
      --shadow-md: 0 4px 20px rgba(78, 52, 46, 0.12);
      --shadow-lg: 0 12px 40px rgba(78, 52, 46, 0.15);
      --shadow-card: 0 2px 8px rgba(78, 52, 46, 0.08);
      
      --tag-bg: rgba(188, 170, 164, 0.2);
      --tag-color: #5d4037;
      --tag-border: rgba(141, 110, 99, 0.3);
      
      --font-main: 'Nanum Myeongjo', serif; /* 선비 스타일 명조체 */
      --font-title: 'Nanum Myeongjo', serif;
      --ticker-bg: rgba(188, 170, 164, 0.1);
      --ticker-border: rgba(188, 170, 164, 0.2);
    }

    /* 조선 테마에서 제목 굵기 조정 및 가로 흔들림 방지 */
    [data-theme="chosun"] h1, [data-theme="chosun"] h2, [data-theme="chosun"] h3 {
      font-weight: 800;
      letter-spacing: -0.05em;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: 100%; overflow-x: clip; position: relative;
    }
    body {
      font-family: var(--font-main);
      background: var(--bg-primary);
      color: var(--text-primary);
      transition: background 0.35s ease, color 0.35s ease;
    }

    /* ── 네비게이션 ── */
    .navbar-header {
      position: sticky; top: 0; z-index: 100;
      border-bottom: 1px solid var(--border-primary);
      backdrop-filter: blur(16px);
      background: var(--bg-nav);
      display: flex; flex-direction: column;
    }
    .navbar-top-row {
      display: flex; align-items: center; justify-content: space-between;
      height: 64px; padding: 0 1.5rem; width: 100%;
    }
    .navbar-actions { display: flex; align-items: center; gap: 10px; }
    
    .navbar-login-btn {
      padding: 7px 16px; border-radius: 8px; border: 1px solid var(--border-primary);
      background: var(--bg-secondary); color: var(--text-primary); font-size: 0.82rem;
      font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 8px;
      white-space: nowrap; transition: all 0.2s ease; box-shadow: var(--shadow-sm);
    }

    .navbar-nav {
      display: flex; gap: 0.25rem; align-items: center; justify-content: center;
      transition: all 0.3s ease;
    }
    @media (min-width: 851px) {
      .navbar-nav { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); }
    }
    @media (max-width: 850px) {
      .navbar-nav {
        width: 100%; padding: 8px 1rem; border-top: 1px solid var(--border-primary);
        justify-content: flex-start; overflow-x: auto; white-space: nowrap; scrollbar-width: none;
        -webkit-overflow-scrolling: touch;
      }
      .navbar-nav::-webkit-scrollbar { display: none; }
      .navbar-top-row { height: 60px; padding: 0 1rem; }
    }

    .nav-link {
      padding: 6px 14px; border-radius: 8px; text-decoration: none;
      color: var(--text-secondary); font-size: 0.82rem; transition: all 0.2s ease; white-space: nowrap;
      font-family: var(--font-main);
    }
    .nav-link.active { background: var(--accent-gradient); color: #fff !important; font-weight: 600; }

    /* ── 모바일 뉴스 박스 ── */
    .mobile-news-box {
      display: none;
      background: var(--bg-card);
      border: 1px solid var(--border-primary);
      border-radius: 16px;
      padding: 1.2rem;
      margin-top: 24px;
      margin-bottom: 40px;
      box-shadow: var(--shadow-card);
    }
    .mobile-news-header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 12px;
    }
    .mobile-news-list { display: flex; flex-direction: column; gap: 10px; }
    .mobile-news-item {
      display: flex; gap: 8px; text-decoration: none; color: var(--text-primary);
      font-size: 0.85rem; line-height: 1.4; padding: 4px 0;
    }
    .mobile-news-item .dot { color: var(--accent-indigo); font-weight: bold; }
    .mobile-news-item:hover .title { text-decoration: underline; }

    @media (max-width: 1100px) {
      .mobile-news-box { display: block; }
    }

    /* ── 정렬 및 그리드 ── */
    .sort-container {
      display: flex; justify-content: flex-end; gap: 4px; margin-bottom: 16px;
      overflow-x: auto; scrollbar-width: none; -webkit-overflow-scrolling: touch;
    }
    .sort-container::-webkit-scrollbar { display: none; }
    @media (max-width: 768px) { .sort-container { justify-content: flex-start !important; } }

    .sort-btn {
      padding: 6px 12px; border-radius: 8px; border: none; background: transparent;
      color: var(--text-muted); font-size: 0.75rem; cursor: pointer; white-space: nowrap;
      font-family: var(--font-main);
    }
    .sort-btn.active { background: var(--bg-tertiary); color: var(--text-primary); font-weight: 600; }

    .main-grid {
      display: grid; grid-template-columns: 1fr 380px; gap: 24px;
      max-width: 1280px; margin: 0 auto; padding: 0 1.5rem; width: 100%;
      align-items: start;
    }
    .tools-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; width: 100%; }

    @media (max-width: 1100px) {
      .main-grid { grid-template-columns: 1fr !important; padding: 0 1.25rem; }
      .sidebar-right { display: none !important; }
      .sidebar-left { display: none !important; }
    }
    @media (max-width: 768px) {
      .main-grid { padding: 0 1rem; }
      .tools-grid { grid-template-columns: 1fr !important; gap: 12px; }
    }

    /* 드롭다운 등 기타 스타일 유지 */
    .navbar-dropdown {
      position: absolute; top: calc(100% + 10px); right: 0;
      background: var(--bg-card); border: 1px solid var(--border-primary);
      border-radius: 12px; padding: 8px; min-width: 240px; z-index: 200;
      box-shadow: 0 8px 32px rgba(0,0,0,0.15);
    }
    .dropdown-item { display: block; width: 100%; padding: 6px 8px; border-radius: 8px; color: var(--text-primary); font-size: 0.82rem; text-decoration: none; text-align: left; background: transparent; border: none; cursor: pointer; }
    .dropdown-item:hover { background: var(--bg-tertiary); }
    .dropdown-divider { height: 1px; background: var(--border-primary); margin: 6px 0; }
    .dropdown-label { font-size: 0.65rem; font-weight: 600; color: var(--text-muted); padding: 4px 8px 6px; }

    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `}</style>
);

export default GlobalStyles;
