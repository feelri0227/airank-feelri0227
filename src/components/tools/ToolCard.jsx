import { getScoreColor, getScoreTextColor, getRankBadge } from "../../utils";

const ToolCard = ({ tool, rank, onClick }) => (
  <div onClick={onClick} style={{
    background: "var(--bg-card)",
    border: "1px solid var(--border-primary)",
    borderRadius: "16px",
    padding: "1.2rem",
    transition: "all 0.25s ease",
    boxShadow: "var(--shadow-card)",
    animation: "fadeInUp 0.4s ease forwards",
    animationDelay: `${rank * 0.05}s`,
    opacity: 0,
    position: "relative",
    cursor: "pointer",
  }}>
    {/* 도구 아이콘 + 이름 + 가격 배지 + 메달 */}
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
      <span style={{ fontSize: "1.5rem" }}>{tool.icon}</span>
      <h3 style={{
        fontFamily: "'Outfit', sans-serif",
        fontSize: "1.1rem",
        fontWeight: 700,
        color: "var(--text-primary)",
      }}>
        {tool.name}
      </h3>
      <span style={{
        fontSize: "0.6rem",
        padding: "2px 8px",
        borderRadius: "100px",
        background: tool.free ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)",
        color: tool.free ? "var(--color-green)" : "var(--color-gold)",
        fontWeight: 600,
      }}>
        {tool.free ? "무료" : "유료"}
      </span>
      <span style={{
        marginLeft: "auto",
        fontSize: rank <= 3 ? "1.3rem" : "0.8rem",
        fontWeight: 700,
        fontFamily: "'Outfit', sans-serif",
        color: "var(--text-muted)",
      }}>
        {getRankBadge(rank)}
      </span>
    </div>

    {/* 설명 */}
    <p style={{
      fontSize: "0.8rem",
      color: "var(--text-secondary)",
      lineHeight: 1.5,
      marginBottom: "8px",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
    }}>
      {tool.desc}
    </p>

    {/* SNS 종합 점수 + 태그 한 줄 */}
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
      <div style={{
        fontSize: "1.5rem",
        fontFamily: "'Outfit', sans-serif",
        fontWeight: 800,
        color: getScoreTextColor(tool.score),
        flexShrink: 0,
      }}>
        {tool.score}
      </div>
      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", flex: 1 }}>
        {tool.tags.filter(tag => tag !== "무료" && tag !== "유료").map((tag) => (
          <span key={tag} style={{
            fontSize: "0.62rem",
            padding: "2px 7px",
            borderRadius: "6px",
            background: "var(--tag-bg)",
            color: "var(--tag-color)",
            border: `1px solid var(--tag-border)`,
            fontWeight: 500,
          }}>
            {tag}
          </span>
        ))}
      </div>
      <span style={{
        fontSize: "0.72rem",
        fontWeight: 600,
        color: tool.change >= 0 ? "var(--color-green)" : "var(--color-red)",
        flexShrink: 0,
      }}>
        {tool.change >= 0 ? "▲" : "▼"} {Math.abs(tool.change)}%
      </span>
    </div>

    {/* 점수 바 */}
    <div style={{
      height: "5px",
      borderRadius: "3px",
      background: "var(--border-primary)",
      overflow: "hidden",
      marginBottom: "8px",
    }}>
      <div style={{
        width: `${tool.score}%`,
        height: "100%",
        borderRadius: "3px",
        background: getScoreColor(tool.score),
        transition: "width 0.8s ease",
      }} />
    </div>

    {/* SNS 플랫폼별 점수 숫자 */}
    <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
      {[
        { label: "네이버", value: tool.sns.naver, color: "#03c75a" },
        { label: "YouTube", value: tool.sns.youtube, color: "#ff0000" },
        { label: "Google", value: tool.sns.google, color: "#4285f4" },
        { label: "GitHub", value: tool.sns.github, color: "#8b5cf6" },
      ].map((p) => (
        <div key={p.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: p.color }}>{p.value}</span>
          <span style={{ fontSize: "0.6rem", color: "var(--text-muted)" }}>{p.label}</span>
        </div>
      ))}
    </div>
  </div>
);

export default ToolCard;
