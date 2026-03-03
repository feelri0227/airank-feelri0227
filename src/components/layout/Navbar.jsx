import Logo from "../ui/Logo";
import ThemeToggle from "../ui/ThemeToggle";
import { NAV_ITEMS } from "../../constants";

const Navbar = ({ theme, onToggleTheme, activeMenu, onMenuChange }) => (
  <header className="navbar-header" style={{
    position: "sticky",
    top: 0,
    zIndex: 100,
    height: "64px",
    padding: "0 1.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid var(--border-primary)",
    backdropFilter: "blur(16px)",
    background: "var(--bg-nav)",
    transition: "all 0.35s ease",
  }}>
    {/* 좌측: 로고 */}
    <Logo theme={theme} />

    {/* 중앙: 네비게이션 메뉴 */}
    <nav className="navbar-nav" style={{
      display: "flex",
      gap: "0.25rem",
      position: "absolute",
      left: "50%",
      transform: "translateX(-50%)",
    }}>
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          onClick={() => onMenuChange(item.id)}
          style={{
            padding: "6px 14px",
            borderRadius: "8px",
            border: "none",
            background: activeMenu === item.id
              ? "var(--accent-gradient)"
              : "transparent",
            color: activeMenu === item.id ? "#fff" : "var(--text-secondary)",
            fontFamily: "'Pretendard', sans-serif",
            fontSize: "0.82rem",
            fontWeight: activeMenu === item.id ? 600 : 400,
            cursor: "pointer",
            transition: "all 0.2s ease",
            whiteSpace: "nowrap",
          }}
        >
          {item.icon} {item.label}
        </button>
      ))}
    </nav>

    {/* 우측: 로그인 + 테마토글 */}
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <button className="navbar-login" style={{
        padding: "7px 18px",
        borderRadius: "8px",
        border: "1px solid var(--border-primary)",
        background: "transparent",
        color: "var(--text-primary)",
        fontFamily: "'Pretendard', sans-serif",
        fontSize: "0.82rem",
        fontWeight: 500,
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}>
        로그인
      </button>
      <ThemeToggle theme={theme} onToggle={onToggleTheme} />
    </div>
  </header>
);

export default Navbar;
