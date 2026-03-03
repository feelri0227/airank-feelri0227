import { getRankBadge } from "../../utils";

const LeftSidebar = ({ tools }) => {
  const top3 = tools.slice(0, 3);
  const trending = [...tools].sort((a, b) => b.change - a.change).slice(0, 3);

  return (
    <aside style={{
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      minWidth: "220px",
    }}>
      {/* TOP 3 박스 */}
      <div style={{
        background: "var(--bg-card)",
        borderRadius: "16px",
        border: "1px solid var(--border-primary)",
        padding: "1.2rem",
        boxShadow: "var(--shadow-card)",
      }}>
        <h3 style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: "0.9rem",
          fontWeight: 700,
          marginBottom: "12px",
          color: "var(--text-primary)",
        }}>
          🏆 TOP 3
        </h3>
        {top3.map((tool, i) => (
          <div key={tool.id} style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 0",
            borderBottom: i < 2 ? "1px solid var(--border-primary)" : "none",
          }}>
            <span style={{ fontSize: "1.1rem" }}>{getRankBadge(i + 1)}</span>
            <span style={{ fontSize: "1.1rem" }}>{tool.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-primary)" }}>{tool.name}</div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>점수 {tool.score}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 급상승 도구 박스 */}
      <div style={{
        background: "var(--bg-card)",
        borderRadius: "16px",
        border: "1px solid var(--border-primary)",
        padding: "1.2rem",
        boxShadow: "var(--shadow-card)",
      }}>
        <h3 style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: "0.9rem",
          fontWeight: 700,
          marginBottom: "12px",
          color: "var(--text-primary)",
        }}>
          🚀 급상승
        </h3>
        {trending.map((tool, i) => (
          <div key={tool.id} style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 0",
            borderBottom: i < 2 ? "1px solid var(--border-primary)" : "none",
          }}>
            <span style={{ fontSize: "1rem" }}>{tool.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-primary)" }}>{tool.name}</div>
            </div>
            <span style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              color: "var(--color-green)",
            }}>
              ▲ {tool.change}%
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default LeftSidebar;
