import { getScoreColor, getScoreTextColor, getRankBadge } from "../../utils";
import SnsScoreBars from "./SnsScoreBars";

const ToolCard = ({ tool, rank, isComparing, onToggleCompare }) => (
  <div style={{
    background: "var(--bg-card)",
    border: `1px solid ${isComparing ? "var(--accent-indigo)" : "var(--border-primary)"}`,
    borderRadius: "16px",
    padding: "1.2rem",
    transition: "all 0.25s ease",
    boxShadow: isComparing ? "0 0 0 2px rgba(99,102,241,0.2)" : "var(--shadow-card)",
    animation: "fadeInUp 0.4s ease forwards",
    animationDelay: `${rank * 0.05}s`,
    opacity: 0,
    position: "relative",
    cursor: "pointer",
  }}>
    {/* 상단: 랭킹 + 비교 체크 */}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
      {/* 랭킹 번호 */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <span style={{
          fontSize: rank <= 3 ? "1.3rem" : "0.85rem",
          fontWeight: 700,
          fontFamily: "'Outfit', sans-serif",
          color: rank <= 3 ? undefined : "var(--text-muted)",
          minWidth: "28px",
        }}>
          {getRankBadge(rank)}
        </span>
        <span style={{ fontSize: "1.5rem" }}>{tool.icon}</span>
      </div>

      {/* 비교 체크박스 */}
      <label style={{
        display: "flex",
        alignItems: "center",
        gap: "4px",
        fontSize: "0.7rem",
        color: "var(--text-muted)",
        cursor: "pointer",
      }}>
        <input
          type="checkbox"
          checked={isComparing}
          onChange={() => onToggleCompare(tool.id)}
          style={{ accentColor: "#6366f1" }}
        />
        비교
      </label>
    </div>

    {/* 도구 이름 + 가격 배지 */}
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
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
    </div>

    {/* 설명 */}
    <p style={{
      fontSize: "0.8rem",
      color: "var(--text-secondary)",
      lineHeight: 1.5,
      marginBottom: "10px",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
    }}>
      {tool.desc}
    </p>

    {/* 태그 */}
    <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "10px" }}>
      {tool.tags.map((tag) => (
        <span key={tag} style={{
          fontSize: "0.68rem",
          padding: "3px 8px",
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

    {/* SNS 종합 점수 */}
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "4px",
    }}>
      <div style={{
        fontSize: "1.5rem",
        fontFamily: "'Outfit', sans-serif",
        fontWeight: 800,
        color: getScoreTextColor(tool.score),
      }}>
        {tool.score}
      </div>
      <div style={{
        flex: 1,
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
          transition: "width 0.8s ease",
        }} />
      </div>
      {/* 주간 변동률 */}
      <span style={{
        fontSize: "0.72rem",
        fontWeight: 600,
        color: tool.change >= 0 ? "var(--color-green)" : "var(--color-red)",
      }}>
        {tool.change >= 0 ? "▲" : "▼"} {Math.abs(tool.change)}%
      </span>
    </div>

    {/* SNS 플랫폼별 점수 바 */}
    <SnsScoreBars sns={tool.sns} />
  </div>
);

export default ToolCard;
