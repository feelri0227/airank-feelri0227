const THEMES = ['light', 'dark', 'manus', 'mono'];
const THEME_ICONS = { light: '☀️', dark: '🌙', manus: '⚡', mono: '◑' };
const THEME_LABELS = { light: '라이트', dark: '다크', manus: '마누스', mono: '모노' };
const NEXT_LABEL = { light: '다크 모드로 전환', dark: '마누스 모드로 전환', manus: '모노 모드로 전환', mono: '라이트 모드로 전환' };

const TRACK_COLORS = {
  light: 'var(--bg-tertiary)',
  dark: 'var(--bg-tertiary)',
  manus: 'rgba(245, 158, 11, 0.15)',
  mono: 'rgba(0, 0, 0, 0.08)',
};

const ThemeToggle = ({ theme, onToggle }) => (
  <button
    onClick={onToggle}
    title={NEXT_LABEL[theme]}
    style={{
      display: "flex",
      alignItems: "center",
      gap: "5px",
      height: "30px",
      padding: "0 8px 0 5px",
      borderRadius: "100px",
      border: `1px solid var(--border-primary)`,
      background: TRACK_COLORS[theme],
      cursor: "pointer",
      transition: "all 0.3s ease",
      flexShrink: 0,
    }}
  >
    <div style={{
      width: "20px",
      height: "20px",
      borderRadius: "50%",
      background: "var(--accent-gradient)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "11px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
      flexShrink: 0,
    }}>
      {THEME_ICONS[theme]}
    </div>
    <span style={{
      fontSize: "11px",
      fontWeight: 500,
      color: "var(--text-secondary)",
      lineHeight: 1,
    }}>
      {THEME_LABELS[theme]}
    </span>
  </button>
);

export default ThemeToggle;
