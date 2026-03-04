import { useState, useEffect } from "react";
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { getScoreTextColor, getRankBadge } from "../../utils";

// tool.id 기반 일관된 의사난수로 7일 점수 생성
const generateSparkData = (tool) => {
  const pseudo = (n) => Math.sin(tool.id * 127.1 + n * 311.7) * 0.5 + 0.5;
  const today = tool.score;
  const weekAgo = today / (1 + tool.change / 100);
  return Array.from({ length: 7 }, (_, i) => {
    if (i === 6) return today;
    const t = i / 6;
    const base = weekAgo + (today - weekAgo) * t;
    return Math.round(Math.max(1, Math.min(100, base + (pseudo(i) - 0.5) * 6)));
  });
};

const SparkChart = ({ data, color }) => {
  const w = 200, h = 44;
  const min = Math.min(...data) - 4;
  const max = Math.max(...data) + 4;
  const range = max - min || 1;
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * w,
    h - ((v - min) / range) * h,
  ]);
  const linePath = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${w},${h} L0,${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} style={{ overflow: "visible", display: "block" }}>
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#sg)" />
      <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r={i === pts.length - 1 ? 3.5 : 2} fill={color} />
      ))}
    </svg>
  );
};

const getFaviconUrl = (url) => {
  try { return `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=64`; }
  catch { return null; }
};

const CAT_LABEL = {
  text: "💬 텍스트", image: "🎨 이미지", code: "💻 코딩",
  video: "🎬 영상", audio: "🎵 오디오", search: "🔍 검색",
  productivity: "⚡ 생산성", design: "✏️ 디자인",
};

const LIFE_LABEL = {
  office: "직장인", student: "학생", freelancer: "프리랜서",
  marketer: "마케터", startup: "스타트업", creator: "크리에이터",
};

const ToolDetailModal = ({ tool, rank, onClose }) => {
  const [iconError, setIconError] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const { user, login } = useAuth();
  const faviconUrl = tool ? getFaviconUrl(tool.url) : null;

  useEffect(() => {
    if (!user || !tool) { setBookmarked(false); return; }
    const ref = doc(db, "bookmarks", `${user.uid}_${tool.id}`);
    getDoc(ref).then((snap) => setBookmarked(snap.exists()));
  }, [user, tool]);

  const toggleBookmark = async () => {
    if (!user) { login(); return; }
    const ref = doc(db, "bookmarks", `${user.uid}_${tool.id}`);
    if (bookmarked) {
      await deleteDoc(ref);
      setBookmarked(false);
    } else {
      await setDoc(ref, { uid: user.uid, toolId: tool.id, toolName: tool.name, savedAt: Date.now() });
      setBookmarked(true);
    }
  };

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
          maxWidth: "340px",
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

        {/* 북마크 버튼 */}
        <button
          onClick={toggleBookmark}
          title={user ? (bookmarked ? "북마크 해제" : "북마크 저장") : "로그인 후 북마크 가능"}
          style={{
            position: "absolute",
            top: "16px",
            right: "56px",
            background: bookmarked ? "rgba(239,68,68,0.1)" : "var(--bg-tertiary)",
            border: bookmarked ? "1px solid #ef4444" : "none",
            borderRadius: "8px",
            width: "32px",
            height: "32px",
            cursor: "pointer",
            fontSize: "1.1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
            color: bookmarked ? "#ef4444" : "var(--text-muted)",
          }}
        >
          {bookmarked ? "♥" : "♡"}
        </button>

        {/* 헤더: 아이콘 + 이름 + 랭크 + 무료/유료 */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px", paddingRight: "40px" }}>
          {!iconError && faviconUrl ? (
            <img
              src={faviconUrl}
              alt={tool.name}
              width={40}
              height={40}
              style={{ borderRadius: "10px", objectFit: "contain", flexShrink: 0 }}
              onError={() => setIconError(true)}
            />
          ) : (
            <span style={{ fontSize: "2.2rem" }}>{tool.icon}</span>
          )}
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
          marginBottom: "16px",
          padding: "14px 16px",
          background: "var(--bg-secondary)",
          borderRadius: "12px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "12px" }}>
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
            <div style={{ width: "1px", height: "40px", background: "var(--border-primary)" }} />
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
          </div>
          {/* 최근 7일 순위 변화 스파크라인 */}
          <div>
            <div style={{ fontSize: "0.62rem", color: "var(--text-muted)", marginBottom: "6px" }}>최근 7일 추이</div>
            <SparkChart data={generateSparkData(tool)} color={getScoreTextColor(tool.score)} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
              <span style={{ fontSize: "0.58rem", color: "var(--text-muted)" }}>7일 전</span>
              <span style={{ fontSize: "0.58rem", color: "var(--text-muted)" }}>오늘</span>
            </div>
          </div>
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

        {/* 카테고리 + 추천 직업군 */}
        <div style={{ marginBottom: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
          {tool.cat && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "0.65rem", fontWeight: 600, color: "var(--text-muted)", flexShrink: 0 }}>카테고리</span>
              <span style={{
                fontSize: "0.68rem",
                padding: "3px 10px",
                borderRadius: "20px",
                background: "var(--accent-gradient)",
                color: "#fff",
                fontWeight: 600,
              }}>
                {CAT_LABEL[tool.cat] ?? tool.cat}
              </span>
            </div>
          )}
          {tool.life?.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.65rem", fontWeight: 600, color: "var(--text-muted)", flexShrink: 0 }}>추천 대상</span>
              <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                {tool.life.map((l) => (
                  <span key={l} style={{
                    fontSize: "0.65rem",
                    padding: "3px 8px",
                    borderRadius: "6px",
                    background: "var(--bg-tertiary)",
                    color: "var(--text-secondary)",
                    border: "1px solid var(--border-primary)",
                    fontWeight: 500,
                  }}>
                    {LIFE_LABEL[l] ?? l}
                  </span>
                ))}
              </div>
            </div>
          )}
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
