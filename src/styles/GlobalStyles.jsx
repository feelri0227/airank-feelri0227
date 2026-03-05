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

    /* 리셋 & 글로벌 */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: 100%;
      height: 100%;
      overflow-x: hidden; /* 페이지 전체 흔들림 방지 */
      position: relative;
    }
    body {
      font-family: 'Pretendard', -apple-system, sans-serif;
      background: var(--bg-primary);
      color: var(--text-primary);
      transition: background 0.35s ease, color 0.35s ease;
      -webkit-font-smoothing: antialiased;
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
    .navbar-nav {
      display: flex; gap: 0.25rem; align-items: center; justify-content: center;
      transition: all 0.3s ease;
      -webkit-overflow-scrolling: touch;
    }
    @media (min-width: 851px) {
      .navbar-nav { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); }
    }
    @media (max-width: 850px) {
      .navbar-nav {
        width: 100%; padding: 8px 1rem; border-top: 1px solid var(--border-primary);
        justify-content: flex-start; overflow-x: auto; white-space: nowrap; scrollbar-width: none;
      }
      .navbar-nav::-webkit-scrollbar { display: none; }
    }

    .nav-link {
      padding: 6px 14px; border-radius: 8px; text-decoration: none;
      color: var(--text-secondary); font-size: 0.82rem; transition: all 0.2s ease; white-space: nowrap;
    }
    .nav-link.active { background: var(--accent-gradient); color: #fff !important; font-weight: 600; }

    /* ── 정렬 컨테이너 최적화 ── */
    .sort-container {
      display: flex;
      justify-content: flex-end;
      gap: 4px;
      margin-bottom: 16px;
      padding-bottom: 4px;
      width: 100%;
      overflow-x: auto;
      scrollbar-width: none; /* 파이어폭스 */
      -webkit-overflow-scrolling: touch; /* iOS 터치 스크롤 */
    }
    .sort-container::-webkit-scrollbar { display: none; } /* 크롬, 사파리 */

    @media (max-width: 768px) {
      .sort-container {
        justify-content: flex-start !important; /* 모바일에서 왼쪽 정렬해야 스크롤이 정상 작동 */
        padding: 0 4px 8px;
      }
    }

    .sort-btn {
      padding: 6px 12px; border-radius: 8px; border: none; background: transparent;
      color: var(--text-muted); font-size: 0.75rem; font-family: 'Pretendard', sans-serif;
      cursor: pointer; white-space: nowrap; transition: all 0.2s ease;
    }
    .sort-btn.active { background: var(--bg-tertiary); color: var(--text-primary); font-weight: 600; }

    /* ── 그리드 시스템 ── */
    .main-grid {
      display: grid; grid-template-columns: 1fr 380px; gap: 24px;
      max-width: 1280px; margin: 0 auto; padding: 0 1.5rem; width: 100%;
    }
    .tools-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; width: 100%; }

    @media (max-width: 1100px) {
      .main-grid { grid-template-columns: 1fr !important; padding: 0 1.25rem; }
      .sidebar-right { display: none !important; }
    }
    @media (max-width: 768px) {
      .main-grid { padding: 0 1rem; }
      .tools-grid { grid-template-columns: 1fr !important; gap: 12px; }
    }

    /* 키프레임 */
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `}</style>
);

export default GlobalStyles;
