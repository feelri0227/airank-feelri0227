import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import Logo from "../ui/Logo";
import ThemeToggle from "../ui/ThemeToggle";
import { NAV_ITEMS } from "../../constants";
import { useAuth } from "../../context/AuthContext";
import { useTools } from "../../context/ToolContext";
import LoginModal from "../modals/LoginModal"; // 추가됨

const Navbar = ({ theme, onToggleTheme }) => {
  const { user, logout } = useAuth();
  const { tools, openToolDetail, newsBookmarks } = useTools();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false); // 로그인 모달 상태 추가
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
    <header className="navbar-header">
      {/* 상단 라인: 로고 + 액션 버튼 (로그인/테마) */}
      <div className="navbar-top-row">
        <Logo />
        
        <div className="navbar-actions">
          {user ? (
            <div ref={dropdownRef} style={{ position: "relative" }}>
              <div
                onClick={() => setShowDropdown((prev) => !prev)}
                style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
              >
                <img
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=random`}
                  alt={user.displayName}
                  width={30}
                  height={30}
                  style={{ borderRadius: "50%", flexShrink: 0 }}
                />
                <span className="user-name">
                  {user.displayName?.split(" ")[0] || "사용자"}
                </span>
              </div>

              {showDropdown && (
                <div className="navbar-dropdown">
                  <div className="dropdown-label">뉴스 북마크 ({newsBookmarks.length})</div>
                  {newsBookmarks.length === 0 ? (
                    <div className="dropdown-empty">북마크한 뉴스가 없어요</div>
                  ) : (
                    newsBookmarks.map((b) => (
                      <a key={b.id} href={b.link} target="_blank" rel="noopener noreferrer" className="dropdown-item">
                        {b.title}
                      </a>
                    ))
                  )}
                  <div className="dropdown-divider" />
                  <div className="dropdown-label">도구 북마크 ({bookmarks.length})</div>
                  {bookmarks.length === 0 ? (
                    <div className="dropdown-empty">북마크한 도구가 없어요</div>
                  ) : (
                    bookmarks.map((b) => (
                      <button key={b.toolId} onClick={() => handleBookmarkClick(b.toolId)} className="dropdown-item">
                        ♥ {b.toolName}
                      </button>
                    ))
                  )}
                  <div className="dropdown-divider" />
                  <button onClick={() => { logout(); setShowDropdown(false); }} className="dropdown-logout">
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setShowLoginModal(true)} className="navbar-login-btn">
                <span>로그인</span>
              </button>
            </div>
          )}
          <ThemeToggle />
        </div>
      </div>

      {/* 하단 라인: 네비게이션 메뉴 */}
      <nav className="navbar-nav">
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
              className={`nav-link ${isActive ? "active" : ""}`}
            >
              {item.icon} {item.label}
            </Link>
          );
        })}
      </nav>

      {/* 로그인 모달 렌더링 */}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </header>
  );
};

export default Navbar;
