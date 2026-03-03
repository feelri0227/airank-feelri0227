import { getScoreColor, getScoreTextColor, getRankBadge } from "../../utils";

const SNS_PLATFORMS = [
  { key: "naver", label: "네이버", color: "#03c75a" },
  { key: "youtube", label: "YouTube", color: "#ff0000" },
  { key: "reddit", label: "Reddit", color: "#ff4500" },
  { key: "github", label: "GitHub", color: "#8b5cf6" },
];

const ToolDetailModal = ({ tool, rank, onClose }) => {
  if (!tool) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-primary)",
          borderRadius: "20px",
          padding: "2rem",
          width: "100%",
          maxWidth: "520px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
          position: "relative",
        }}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "var(--bg-tertiary)",
            border: "none",
            borderRadius: "8px",
            width: "32px",
            height: "32px",
            cursor: "pointer",
            fontSize: "1rem",
            color: "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ✕
        </button>

        {/* 헤더: 아이콘 + 이름 + 랭크 + 무료/유료 */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px", paddingRight: "40px" }}>
          <span style={{ fontSize: "2.2rem" }}>{tool.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <h2 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "1.4rem",
                fontWeight: 800,
                color: "var(--text-primary)",
                margin: 0,
              }}>
                {tool.name}
              </h2>
              <span style={{
                fontSize: "0.65rem",
                padding: "2px 8px",
                borderRadius: "100px",
                background: tool.free ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)",
                color: tool.free ? "var(--color-green)" : "var(--color-gold)",
                fontWeight: 600,
              }}>
                {tool.free ? "무료" : "유료"}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
              <span style={{
                fontSize: "0.78rem",
                fontWeight: 700,
                fontFamily: "'Outfit', sans-serif",
                color: "var(--text-muted)",
              }}>
                {getRankBadge(rank)} {rank <= 3 ? "" : `${rank}위`}
              </span>
            </div>
          </div>
        </div>

        {/* 설명 */}
        <p style={{
          fontSize: "0.88rem",
          color: "var(--text-secondary)",
          lineHeight: 1.7,
          marginBottom: "20px",
        }}>
          {tool.desc}
        </p>

        {/* 점수 + 주간 변화율 */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "16px",
          padding: "14px 16px",
          background: "var(--bg-secondary)",
          borderRadius: "12px",
        }}>
          <div>
            <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginBottom: "2px" }}>SNS 종합 점수</div>
            <div style={{
              fontSize: "2.2rem",
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 800,
              color: getScoreTextColor(tool.score),
              lineHeight: 1,
            }}>
              {tool.score}
            </div>
          </div>
          <div style={{
            width: "1px",
            height: "40px",
            background: "var(--border-primary)",
          }} />
          <div>
            <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginBottom: "2px" }}>주간 변화율</div>
            <div style={{
              fontSize: "1.3rem",
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              color: tool.change >= 0 ? "var(--color-green)" : "var(--color-red)",
            }}>
              {tool.change >= 0 ? "▲" : "▼"} {Math.abs(tool.change)}%
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              height: "6px",
              borderRadius: "3px",
              background: "var(--border-primary)",
              overflow: "hidden",
            }}>
              <div style={{
                width: `${tool.score}%`,
                height: "100%",
                borderRadius: "3px",
                background: getScoreColor(tool.score),
              }} />
            </div>
          </div>
        </div>

        {/* 플랫폼별 점수 바 */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "10px" }}>플랫폼별 언급 지수</div>
          {SNS_PLATFORMS.map((p) => (
            <div key={p.key} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span style={{ fontSize: "0.72rem", color: p.color, fontWeight: 600, width: "58px", flexShrink: 0 }}>{p.label}</span>
              <div style={{
                flex: 1,
                height: "8px",
                borderRadius: "4px",
                background: "var(--border-primary)",
                overflow: "hidden",
              }}>
                <div style={{
                  width: `${tool.sns[p.key]}%`,
                  height: "100%",
                  borderRadius: "4px",
                  background: p.color,
                  opacity: 0.85,
                  transition: "width 0.6s ease",
                }} />
              </div>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: p.color, width: "28px", textAlign: "right", flexShrink: 0 }}>
                {tool.sns[p.key]}
              </span>
            </div>
          ))}
        </div>

        {/* 핵심 기능 */}
        {tool.features && (
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "10px" }}>핵심 기능</div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "6px" }}>
              {tool.features.map((f, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                  <span style={{ color: "var(--accent-indigo)", fontWeight: 700, fontSize: "0.75rem", marginTop: "1px", flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 태그 */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "20px" }}>
          {tool.tags.filter(tag => tag !== "무료" && tag !== "유료").map((tag) => (
            <span key={tag} style={{
              fontSize: "0.65rem",
              padding: "3px 8px",
              borderRadius: "6px",
              background: "var(--tag-bg)",
              color: "var(--tag-color)",
              border: "1px solid var(--tag-border)",
              fontWeight: 500,
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* 공식 사이트 바로가기 */}
        {tool.url && (
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              textAlign: "center",
              padding: "12px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, var(--accent-indigo), var(--accent-cyan))",
              color: "#fff",
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              fontSize: "0.9rem",
              textDecoration: "none",
              transition: "opacity 0.2s ease",
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
          >
            공식 사이트 바로가기 →
          </a>
        )}
      </div>
    </div>
  );
};

export default ToolDetailModal;
