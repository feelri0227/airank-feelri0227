import { getRankBadge } from "../../utils";
import { useTools } from "../../context/ToolContext";

const LeftSidebar = ({ tools }) => {
  const { openToolDetail } = useTools();
  const top3 = [...tools].sort((a, b) => b.score - a.score).slice(0, 3);
  const trending = [...tools].sort((a, b) => b.change - a.change).slice(0, 3);

  return (
    <aside className="sidebar-left" style={{
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      minWidth: "220px",
      position: "sticky",
      top: "80px",
      alignSelf: "start",
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
          <div key={tool.id}
            onClick={() => openToolDetail(tool, i + 1)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 4px",
              borderBottom: i < 2 ? "1px solid var(--border-primary)" : "none",
              cursor: "pointer",
              borderRadius: "8px",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--bg-tertiary)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
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
        {trending.map((tool, i) => {
          const rank = [...tools].sort((a, b) => b.score - a.score).findIndex(t => t.id === tool.id) + 1;
          return (
            <div key={tool.id}
              onClick={() => openToolDetail(tool, rank)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px 4px",
                borderBottom: i < 2 ? "1px solid var(--border-primary)" : "none",
                cursor: "pointer",
                borderRadius: "8px",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--bg-tertiary)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
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
          );
        })}
      </div>
    </aside>
  );
};

export default LeftSidebar;
