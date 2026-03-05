const GlobalStyles = () => (
  <style>{`
    /* ── Google Fonts 로드 ── */
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
    @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

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

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Pretendard', -apple-system, sans-serif;
      background: var(--bg-primary);
      color: var(--text-primary);
      transition: background 0.35s ease, color 0.35s ease;
      overflow-x: hidden;
      width: 100%;
    }

    /* ── 네비게이션 스타일 ── */
    .navbar-header {
      position: sticky;
      top: 0;
      z-index: 100;
      borderBottom: 1px solid var(--border-primary);
      backdropFilter: blur(16px);
      background: var(--bg-nav);
      transition: all 0.35s ease;
      display: flex;
      flex-direction: column; /* 기본적으로 세로 배치 가능성 열어둠 */
    }

    .navbar-top-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 64px;
      padding: 0 1.5rem;
      width: 100%;
    }

    .navbar-actions {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }

    .navbar-nav {
      display: flex;
      gap: 0.25rem;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    /* PC 버전: 네비게이션이 상단 행 중앙에 위치 */
    @media (min-width: 851px) {
      .navbar-nav {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }

    /* 태블릿/모바일 버전: 네비게이션이 별도 행으로 내려감 */
    @media (max-width: 850px) {
      .navbar-header {
        height: auto !important;
      }
      .navbar-nav {
        width: 100%;
        padding: 8px 1rem;
        border-top: 1px solid var(--border-primary);
        justify-content: flex-start;
        overflow-x: auto;
        white-space: nowrap;
        scrollbar-width: none;
      }
      .navbar-nav::-webkit-scrollbar { display: none; }
      
      .navbar-top-row {
        height: 60px;
        padding: 0 1rem;
      }
      .user-name {
        max-width: 60px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .nav-link {
      padding: 6px 14px;
      border-radius: 8px;
      text-decoration: none;
      color: var(--text-secondary);
      font-family: 'Pretendard', sans-serif;
      font-size: 0.82rem;
      font-weight: 400;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    .nav-link.active {
      background: var(--accent-gradient);
      color: #fff !important;
      font-weight: 600;
    }

    /* 드롭다운 스타일 */
    .navbar-dropdown {
      position: absolute;
      top: calc(100% + 10px);
      right: 0;
      background: var(--bg-card);
      border: 1px solid var(--border-primary);
      border-radius: 12px;
      padding: 8px;
      min-width: 240px;
      max-height: 320px;
      overflow-y: auto;
      box-shadow: 0 8px 32px rgba(0,0,0,0.15);
      z-index: 200;
    }
    .dropdown-label { fontSize: 0.65rem; fontWeight: 600; color: var(--text-muted); padding: 4px 8px 6px; }
    .dropdown-empty { fontSize: 0.78rem; color: var(--text-muted); padding: 8px; textAlign: center; }
    .dropdown-item { display: block; width: 100%; padding: 6px 8px; borderRadius: 8px; border: none; background: transparent; color: var(--text-primary); fontSize: 0.82rem; textAlign: left; cursor: pointer; textDecoration: none; }
    .dropdown-item:hover { background: var(--bg-tertiary); }
    .dropdown-divider { height: 1px; background: var(--border-primary); margin: 6px 0; }
    .dropdown-logout { display: block; width: 100%; padding: 6px 8px; borderRadius: 8px; border: none; background: transparent; color: var(--text-muted); fontSize: 0.78rem; textAlign: left; cursor: pointer; }
    .dropdown-logout:hover { background: var(--bg-tertiary); }

    /* 로그인 버튼 */
    .navbar-login-btn {
      padding: 7px 18px;
      border-radius: 8px;
      border: 1px solid var(--border-primary);
      background: transparent;
      color: var(--text-primary);
      font-family: 'Pretendard', sans-serif;
      font-size: 0.82rem;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
    }

    /* ── 그리드 스타일 ── */
    .main-grid {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 24px;
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 1.5rem;
      width: 100%;
    }
    .tools-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      width: 100%;
    }

    @media (max-width: 1100px) {
      .main-grid { grid-template-columns: 1fr !important; padding: 0 1.25rem; }
      .sidebar-right { display: none !important; }
    }
    @media (max-width: 768px) {
      .main-grid { padding: 0 1rem; }
      .tools-grid { grid-template-columns: 1fr !important; gap: 12px; }
    }

    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes tickerScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
  `}</style>
);

export default GlobalStyles;
