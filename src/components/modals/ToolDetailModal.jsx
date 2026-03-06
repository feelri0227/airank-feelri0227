import { useState, useEffect } from "react";
import { doc, deleteDoc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { getScoreTextColor, getRankBadge } from "../../utils";

// 점수 그래프 생성 함수
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
  const w = 200, h = 34;
  const min = Math.min(...data) - 4;
  const max = Math.max(...data) + 4;
  const range = max - min || 1;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - ((v - min) / range) * h]);
  const linePath = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${w},${h} L0,${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} style={{ overflow: "visible", display: "block" }}>
      <defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.25" /><stop offset="100%" stopColor={color} stopOpacity="0" /></linearGradient></defs>
      <path d={areaPath} fill="url(#sg)" /><path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {pts.map(([x, y], i) => <circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r={i === pts.length - 1 ? 3.5 : 2} fill={color} />)}
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

// 플랫폼 로고 (Google Favicon API)
const PlatformLogo = ({ domain, size = 18 }) => (
  <img
    src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
    alt={domain}
    style={{ width: size, height: size, borderRadius: "4px", flexShrink: 0 }}
  />
);

const SNS_PLATFORMS = [
  { key: "naver",   label: "Naver",   domain: "naver.com",   color: "#03C75A" },
  { key: "youtube", label: "YouTube", domain: "youtube.com", color: "#FF0000" },
  { key: "google",  label: "Google",  domain: "google.com",  color: "#4285F4" },
  { key: "github",  label: "GitHub",  domain: "github.com",  color: "#8b949e" },
];

// [오른쪽] 심층 분석 카드
const ToolAnalysisCard = ({ tool }) => {
  const [videos, setVideos] = useState(null); // null=로딩중, []=없음, [...]=있음

  useEffect(() => {
    fetch("/youtube-videos.json")
      .then((r) => r.json())
      .then((data) => {
        const toolVideos = data.videos?.[String(tool.id)];
        setVideos(toolVideos || []);
      })
      .catch(() => setVideos([]));
  }, [tool.id]);

  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent((tool.yt || tool.name) + " tutorial")}`;

  return (
    <div style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border-primary)",
      borderRadius: "24px",
      padding: "1.5rem",
      width: "100%", maxWidth: "340px", minWidth: "300px",
      display: "flex", flexDirection: "column",
      boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
      height: "fit-content"
    }}>
      <h3 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: "1rem", color: "var(--text-primary)" }}>
        실시간 트렌드 지표
      </h3>

      {/* 플랫폼 점수 1행 */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "1.25rem" }}>
        {SNS_PLATFORMS.map(({ key, label, domain, color }) => {
          const value = tool.sns?.[key] || 0;
          return (
            <div key={key} style={{
              flex: 1,
              display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
              padding: "12px 8px",
              background: "var(--bg-secondary)",
              borderRadius: "12px",
            }}>
              <PlatformLogo domain={domain} size={24} />
              <div style={{ fontSize: "0.6rem", color: "var(--text-muted)", fontWeight: 500 }}>{label}</div>
              <div style={{ fontSize: "1.05rem", fontWeight: 800, color, lineHeight: 1, fontFamily: "'Outfit', sans-serif" }}>{value}</div>
            </div>
          );
        })}
      </div>

      <div style={{ padding: "12px 14px", background: "var(--bg-secondary)", borderRadius: "12px", marginBottom: "1.5rem", border: "1px solid var(--border-primary)" }}>
         <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
           <span style={{ color: "var(--accent-indigo)", fontWeight: 700 }}>💡 분석결과:</span><br/>
           {tool.sns?.github > 50
             ? "개발자 중심의 강력한 커뮤니티 지지를 받고 있습니다."
             : "현재 영상 플랫폼을 중심으로 대중적 인지도가 급상승 중입니다."}
         </p>
      </div>

      <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "1rem", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
        🎥 튜토리얼 & 리뷰
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {videos === null ? (
          // 로딩 중
          [1, 2, 3].map((i) => (
            <div key={i} style={{
              height: "70px", borderRadius: "16px",
              background: "var(--bg-secondary)", border: "1px solid var(--border-primary)",
              animation: "pulse 1.5s ease-in-out infinite",
            }} />
          ))
        ) : videos.length > 0 ? (
          // 실제 YouTube 영상
          videos.map((video) => (
            <a
              key={video.videoId}
              href={`https://www.youtube.com/watch?v=${video.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex", gap: "12px", textDecoration: "none",
                padding: "10px", borderRadius: "16px", background: "var(--bg-secondary)",
                border: "1px solid var(--border-primary)",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.borderColor = "var(--accent-indigo)";
                e.currentTarget.style.background = "var(--bg-tertiary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "var(--border-primary)";
                e.currentTarget.style.background = "var(--bg-secondary)";
              }}
            >
              <div style={{
                width: "90px", height: "50px", borderRadius: "10px",
                overflow: "hidden", flexShrink: 0, position: "relative", background: "#000"
              }}>
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div style={{
                  position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(0,0,0,0.2)"
                }}>
                  <div style={{
                    width: "20px", height: "20px", background: "#FF0000", borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 4px 8px rgba(255,0,0,0.3)"
                  }}>
                    <div style={{ width: 0, height: 0, borderTop: "4px solid transparent", borderBottom: "4px solid transparent", borderLeft: "6px solid white", marginLeft: "1.5px" }} />
                  </div>
                </div>
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{
                  fontSize: "0.8rem", fontWeight: 700, color: "var(--text-primary)",
                  display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                  overflow: "hidden", lineHeight: 1.3
                }}>
                  {video.title}
                </div>
                <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginTop: "4px" }}>{video.channelTitle}</div>
              </div>
            </a>
          ))
        ) : (
          // 영상 없음 → YouTube 검색 링크
          <a
            href={searchUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              padding: "16px", borderRadius: "16px", background: "var(--bg-secondary)",
              border: "1px solid var(--border-primary)", textDecoration: "none",
              color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: 600,
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#FF0000"; e.currentTarget.style.color = "#FF0000"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-primary)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
          >
            <img src="https://www.google.com/s2/favicons?domain=youtube.com&sz=32" alt="YouTube" style={{ width: 20, height: 20 }} />
            YouTube에서 검색하기 →
          </a>
        )}
      </div>
    </div>
  );
};

// [메인] 모달 컴포넌트
const ToolDetailModal = ({ tool, rank, onClose }) => {
  const [iconError, setIconError] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user, login } = useAuth();
  const faviconUrl = tool ? getFaviconUrl(tool.url) : null;

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 900);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    if (!user || !tool) { setBookmarked(false); return; }
    const ref = doc(db, "bookmarks", `${user.uid}_${tool.id}`);
    getDoc(ref).then((snap) => setBookmarked(snap.exists()));
  }, [user, tool]);

  const toggleBookmark = async () => {
    if (!user) { login(); return; }
    const ref = doc(db, "bookmarks", `${user.uid}_${tool.id}`);
    if (bookmarked) { await deleteDoc(ref); setBookmarked(false); }
    else { await setDoc(ref, { uid: user.uid, toolId: tool.id, toolName: tool.name, savedAt: Date.now() }); setBookmarked(true); }
  };

  if (!tool) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(4px)",
        overflowY: "auto",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "40px 16px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "flex-start",
          gap: "16px",
          width: "auto",
          maxWidth: "100%",
          margin: "auto",
        }}
      >
        {/* [왼쪽] 기존 상세 정보 카드 */}
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-primary)",
          borderRadius: "24px",
          padding: isMobile ? "1.25rem" : "1.5rem",
          width: "100%", maxWidth: "340px", minWidth: "300px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
          position: "relative",
          height: "fit-content"
        }}>
          <button onClick={onClose} style={{ position: "absolute", top: isMobile ? "12px" : "16px", right: isMobile ? "12px" : "16px", background: "var(--bg-tertiary)", border: "none", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", fontSize: "1rem", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
          <button onClick={toggleBookmark} title={user ? (bookmarked ? "북마크 해제" : "북마크 저장") : "로그인 후 북마크 가능"} style={{ position: "absolute", top: isMobile ? "12px" : "16px", right: isMobile ? "52px" : "56px", background: bookmarked ? "rgba(239,68,68,0.1)" : "var(--bg-tertiary)", border: bookmarked ? "1px solid #ef4444" : "none", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s ease", color: bookmarked ? "#ef4444" : "var(--text-muted)" }}>{bookmarked ? "♥" : "♡"}</button>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
            {!iconError && faviconUrl ? ( <img src={faviconUrl} alt={tool.name} width={isMobile ? 36 : 40} height={isMobile ? 36 : 40} style={{ borderRadius: "10px", objectFit: "contain", flexShrink: 0 }} onError={() => setIconError(true)} /> ) : ( <span style={{ fontSize: isMobile ? "2rem" : "2.2rem" }}>{tool.icon}</span> )}
            <div style={{ flex: 1 }}>
              <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: isMobile ? "1.3rem" : "1.5rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>{tool.name}</h2>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}><span style={{ fontSize: "0.78rem", fontWeight: 700, fontFamily: "'Outfit', sans-serif", color: "var(--text-muted)" }}>{getRankBadge(rank)}</span></div>
            </div>
          </div>

          <p style={{ fontSize: isMobile ? "0.85rem" : "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: isMobile ? "20px" : "24px" }}>{tool.desc}</p>

          <div style={{ marginBottom: isMobile ? "20px" : "18px", padding: isMobile ? "10px 12px" : "12px 14px", background: "var(--bg-secondary)", borderRadius: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
              <div><div style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginBottom: "2px" }}>종합 점수</div><div style={{ fontSize: isMobile ? "1.5rem" : "1.7rem", fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: getScoreTextColor(tool.score), lineHeight: 1 }}>{tool.score}</div></div>
              <div style={{ width: "1px", height: "34px", background: "var(--border-primary)" }} />
              <div><div style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginBottom: "2px" }}>주간 변화율</div><div style={{ fontSize: isMobile ? "0.95rem" : "1.05rem", fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: tool.change >= 0 ? "var(--color-green)" : "var(--color-red)" }}>{tool.change >= 0 ? "▲" : "▼"} {Math.abs(tool.change)}%</div></div>
            </div>
            <SparkChart data={generateSparkData(tool)} color={getScoreTextColor(tool.score)} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}><span style={{ fontSize: "0.6rem", color: "var(--text-muted)" }}>7일 전</span><span style={{ fontSize: "0.6rem", color: "var(--text-muted)" }}>오늘</span></div>
          </div>

          {tool.features && ( <div style={{ marginBottom: isMobile ? "20px" : "24px" }}><div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "10px" }}>핵심 기능</div><ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>{tool.features.map((f, i) => ( <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}><span style={{ color: "var(--accent-indigo)", fontWeight: 800, fontSize: "0.8rem", marginTop: "2px", flexShrink: 0 }}>✓</span><span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>{f}</span></li>))}</ul></div>)}

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: isMobile ? "20px" : "24px" }}>{tool.tags.filter(tag => tag !== "무료" && tag !== "유료").map((tag) => ( <span key={tag} style={{ fontSize: "0.7rem", padding: "4px 10px", borderRadius: "8px", background: "var(--tag-bg)", color: "var(--tag-color)", border: "1px solid var(--tag-border)", fontWeight: 600 }}>{tag}</span>))}</div>

          <div style={{ marginBottom: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {tool.cat && ( <div style={{ display: "flex", alignItems: "center", gap: "10px" }}><span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)", flexShrink: 0 }}>카테고리</span><span style={{ fontSize: "0.75rem", padding: "4px 12px", borderRadius: "20px", background: "var(--accent-gradient)", color: "#fff", fontWeight: 700 }}>{CAT_LABEL[tool.cat] ?? tool.cat}</span></div>)}
            {tool.life?.length > 0 && ( <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}><span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)", flexShrink: 0 }}>추천 대상</span><div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>{tool.life.map((l) => ( <span key={l} style={{ fontSize: "0.7rem", padding: "4px 10px", borderRadius: "8px", background: "var(--bg-tertiary)", color: "var(--text-secondary)", border: "1px solid var(--border-primary)", fontWeight: 600 }}>{LIFE_LABEL[l] ?? l}</span>))}</div></div>)}
          </div>

          {tool.url && ( <a href={tool.url} target="_blank" rel="noopener noreferrer" style={{ display: "block", textAlign: "center", padding: "14px", borderRadius: "16px", background: "linear-gradient(135deg, var(--accent-indigo), var(--accent-cyan))", color: "#fff", fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "1rem", textDecoration: "none", transition: "all 0.2s ease", boxShadow: "0 8px 16px rgba(79, 70, 229, 0.2)" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 20px rgba(79, 70, 229, 0.3)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 16px rgba(79, 70, 229, 0.2)"; }}>공식 사이트 방문 →</a>)}
        </div>

        {/* [오른쪽] 심층 분석 카드 */}
        <ToolAnalysisCard tool={tool} />

      </div>
    </div>
  );
};

export default ToolDetailModal;
