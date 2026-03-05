import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import Logo from "../ui/Logo";
import ThemeToggle from "../ui/ThemeToggle";
import { NAV_ITEMS } from "../../constants";
import { useAuth } from "../../context/AuthContext";
import { useTools } from "../../context/ToolContext";

const Navbar = ({ theme, onToggleTheme }) => {
  const { user, login, logout } = useAuth();
  const { tools, openToolDetail, newsBookmarks } = useTools();
  const [showDropdown, setShowDropdown] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const dropdownRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (!showDropdown || !user) return;
    const q = query(collection(db, "bookmarks"), where("uid", "==", user.uid));
    getDocs(q).then((snap) => setBookmarks(snap.docs.map((d) => d.data())));
  }, [showDropdown, user]);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleBookmarkClick = (toolId) => {
    if (!tools) return;
    const sorted = [...tools].sort((a, b) => b.score - a.score);
    const idx = sorted.findIndex((t) => t.id === toolId);
    if (idx !== -1) {
      openToolDetail(sorted[idx], idx + 1);
      setShowDropdown(false);
    }
  };

  const getActiveMenu = () => {
    if (location.pathname.startsWith("/community")) return "community";
    if (location.pathname === "/news") return "news";
    return "ranking";
  };

  const activeMenu = getActiveMenu();

  return (
    <header
      className="navbar-header"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        height: "64px",
        padding: "0 1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between", /* 로고 - 메뉴 - 버튼 순으로 벌림 */
        borderBottom: "1px solid var(--border-primary)",
        backdropFilter: "blur(16px)",
        background: "var(--bg-nav)",
        transition: "all 0.35s ease",
        gap: "10px",
      }}
    >
      <div style={{ flexShrink: 0 }}>
        <Logo />
      </div>

      <nav
        className="navbar-nav"
        style={{
          display: "flex",
          gap: "4px",
          alignItems: "center",
          flexGrow: 1,
          justifyContent: "center",
          /* 모바일에서는 중앙 배치가 아니라 일반 배치가 되도록 유동적으로 처리됨 */
        }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeMenu === item.id;
          const path =
            item.id === "news" ? "/news" :
            item.id === "community" ? "/community" :
            item.id === "ranking" ? "/" : "/";

          return (
            <Link
              to={path}
              key={item.id}
              className="nav-link"
              style={{
                padding: "6px 12px",
                borderRadius: "8px",
                textDecoration: "none",
                background:
                  isActive ? "var(--accent-gradient)" : "transparent",
                color: isActive ? "#fff" : "var(--text-secondary)",
                fontFamily: "'Pretendard', sans-serif",
                fontSize: "0.82rem",
                fontWeight: isActive ? 600 : 400,
                cursor: "pointer",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
        {user ? (
          <div ref={dropdownRef} style={{ position: "relative" }}>
            <div
              onClick={() => setShowDropdown((prev) => !prev)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
              }}
            >
              <img
                src={user.photoURL}
                alt={user.displayName}
                width={28}
                height={28}
                style={{ borderRadius: "50%", flexShrink: 0 }}
              />
              <span
                className="user-name"
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 500,
                  color: "var(--text-primary)",
                  maxWidth: "60px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user.displayName?.split(" ")[0]}
              </span>
            </div>

            {showDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 10px)",
                  right: 0,
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-primary)",
                  borderRadius: "12px",
                  padding: "8px",
                  minWidth: "200px",
                  maxHeight: "320px",
                  overflowY: "auto",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                  zIndex: 200,
                }}
              >
                {/* 드롭다운 내용은 기존과 동일 */}
                <div style={{ fontSize: "0.65rem", fontWeight: 600, color: "var(--text-muted)", padding: "4px 8px 6px" }}>
                  뉴스 북마크 ({newsBookmarks.length})
                </div>
                {newsBookmarks.length === 0 ? (
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", padding: "8px", textAlign: "center" }}>북마크한 뉴스가 없어요</div>
                ) : (
                  newsBookmarks.map((b) => (
                    <a key={b.id} href={b.link} target="_blank" rel="noopener noreferrer" style={{ display: "block", width: "100%", padding: "6px 8px", borderRadius: "8px", color: "var(--text-primary)", fontSize: "0.82rem", textDecoration: 'none' }} onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-tertiary)")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                      {b.title}
                    </a>
                  ))
                )}
                <div style={{ height: "1px", background: "var(--border-primary)", margin: "6px 0" }} />
                <div style={{ fontSize: "0.65rem", fontWeight: 600, color: "var(--text-muted)", padding: "4px 8px 6px" }}>
                  도구 북마크 ({bookmarks.length})
                </div>
                {bookmarks.length === 0 ? (
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", padding: "8px", textAlign: "center" }}>북마크한 도구가 없어요</div>
                ) : (
                  bookmarks.map((b) => (
                    <button key={b.toolId} onClick={() => handleBookmarkClick(b.toolId)} style={{ display: "block", width: "100%", padding: "6px 8px", borderRadius: "8px", border: "none", background: "transparent", color: "var(--text-primary)", fontSize: "0.82rem", textAlign: "left", cursor: "pointer" }} onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-tertiary)")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                      ♥ {b.toolName}
                    </button>
                  ))
                )}
                <div style={{ height: "1px", background: "var(--border-primary)", margin: "6px 0" }} />
                <button onClick={() => { logout(); setShowDropdown(false); }} style={{ display: "block", width: "100%", padding: "6px 8px", borderRadius: "8px", border: "none", background: "transparent", color: "var(--text-muted)", fontSize: "0.78rem", textAlign: "left", cursor: "pointer" }} onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-tertiary)")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  로그아웃
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={login}
            className="navbar-login"
            style={{
              padding: "6px 14px",
              borderRadius: "8px",
              border: "1px solid var(--border-primary)",
              background: "transparent",
              color: "var(--text-primary)",
              fontFamily: "'Pretendard', sans-serif",
              fontSize: "0.8rem",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              whiteSpace: "nowrap",
            }}
          >
            <img src="https://www.google.com/favicon.ico" width={12} height={12} alt="Google" />
            <span className="login-text">로그인</span>
          </button>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Navbar;
