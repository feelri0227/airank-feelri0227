const ThemeToggle = ({ theme, onToggle }) => (
  <button
    onClick={onToggle}
    title={theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
    style={{
      width: "44px",
      height: "26px",
      borderRadius: "100px",
      border: `1px solid var(--border-primary)`,
      background: theme === "dark" ? "var(--bg-tertiary)" : "var(--bg-tertiary)",
      cursor: "pointer",
      position: "relative",
      transition: "all 0.3s ease",
      flexShrink: 0,
    }}
  >
    <div style={{
      position: "absolute",
      top: "3px",
      left: theme === "dark" ? "3px" : "19px",
      width: "18px",
      height: "18px",
      borderRadius: "50%",
      background: "var(--accent-gradient)",
      transition: "left 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "10px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
    }}>
      {theme === "dark" ? "🌙" : "☀️"}
    </div>
  </button>
);

export default ThemeToggle;
