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

// [오른쪽] 새로 추가되는 심층 분석 카드 (디자인 개선됨)
const ToolAnalysisCard = ({ tool }) => {
  // SNS 차트 컴포넌트 (Thin Line 스타일)
  const SnsBar = ({ label, value, color, icon }) => (
    <div style={{ marginBottom: "10px", display: "flex", alignItems: "center", gap: "10px", fontSize: "0.8rem" }}>
      <div style={{ width: "100px", fontWeight: 600, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
        {icon} {label}
      </div>
      <div style={{ flex: 1, height: "6px", background: "var(--bg-tertiary)", borderRadius: "3px", overflow: "hidden" }}>
        <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: "3px" }} />
      </div>
      <div style={{ width: "32px", textAlign: "right", fontWeight: 700, color: color, fontSize: "0.75rem" }}>
        {value}%
      </div>
    </div>
  );

  return (
    <div style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border-primary)",
      borderRadius: "20px",
      padding: "1.25rem",
      width: "100%", maxWidth: "340px",
      display: "flex", flexDirection: "column",
      boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
      height: "fit-content"
    }}>
      <h3 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "6px", color: "var(--text-primary)" }}>
        📊 실시간 트렌드
      </h3>

      <div style={{ marginBottom: "1.2rem" }}>
        <SnsBar label="Naver" value={tool.sns?.naver || 0} color="#03C75A" icon="🇳" />
        <SnsBar label="YouTube" value={tool.sns?.youtube || 0} color="#FF0000" icon="▶" />
        <SnsBar label="Google" value={tool.sns?.google || 0} color="#4285F4" icon="🇬" />
        <SnsBar label="GitHub" value={tool.sns?.github || 0} color="#181717" icon="🐙" />
      </div>
      
      <div style={{ padding: "12px", background: "var(--bg-tertiary)", borderRadius: "12px" }}>
         <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
           <strong>💡 AI 인사이트:</strong><br/>
           {tool.sns?.github > 50 
             ? "개발자 커뮤니티에서 기술적 관심도가 매우 높습니다." 
             : "대중적인 검색량과 영상 조회수가 상승세입니다."}
         </p>
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
          borderRadius: "20px",
          padding: isMobile ? "1rem" : "1.25rem",
          width: "100%", maxWidth: "340px", minWidth: "300px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
          position: "relative",
          height: "fit-content"
        }}>
          <button onClick={onClose} style={{ position: "absolute", top: isMobile ? "12px" : "16px", right: isMobile ? "12px" : "16px", background: "var(--bg-tertiary)", border: "none", borderRadius: "8px", width: "32px", height: "32px", cursor: "pointer", fontSize: "1rem", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
          <button onClick={toggleBookmark} title={user ? (bookmarked ? "북마크 해제" : "북마크 저장") : "로그인 후 북마크 가능"} style={{ position: "absolute", top: isMobile ? "12px" : "16px", right: isMobile ? "52px" : "56px", background: bookmarked ? "rgba(239,68,68,0.1)" : "var(--bg-tertiary)", border: bookmarked ? "1px solid #ef4444" : "none", borderRadius: "8px", width: "32px", height: "32px", cursor: "pointer", fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s ease", color: bookmarked ? "#ef4444" : "var(--text-muted)" }}>{bookmarked ? "♥" : "♡"}</button>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
            {!iconError && faviconUrl ? ( <img src={faviconUrl} alt={tool.name} width={isMobile ? 36 : 40} height={isMobile ? 36 : 40} style={{ borderRadius: "10px", objectFit: "contain", flexShrink: 0 }} onError={() => setIconError(true)} /> ) : ( <span style={{ fontSize: isMobile ? "2rem" : "2.2rem" }}>{tool.icon}</span> )}
            <div style={{ flex: 1 }}>
              <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: isMobile ? "1.25rem" : "1.4rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>{tool.name}</h2>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}><span style={{ fontSize: "0.78rem", fontWeight: 700, fontFamily: "'Outfit', sans-serif", color: "var(--text-muted)" }}>{getRankBadge(rank)}</span></div>
            </div>
          </div>

          <p style={{ fontSize: isMobile ? "0.82rem" : "0.88rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: isMobile ? "16px" : "20px" }}>{tool.desc}</p>

          <div style={{ marginBottom: isMobile ? "16px" : "14px", padding: isMobile ? "8px 10px" : "10px 12px", background: "var(--bg-secondary)", borderRadius: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
              <div><div style={{ fontSize: "0.6rem", color: "var(--text-muted)", marginBottom: "1px" }}>종합 점수</div><div style={{ fontSize: isMobile ? "1.4rem" : "1.6rem", fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: getScoreTextColor(tool.score), lineHeight: 1 }}>{tool.score}</div></div>
              <div style={{ width: "1px", height: "30px", background: "var(--border-primary)" }} />
              <div><div style={{ fontSize: "0.6rem", color: "var(--text-muted)", marginBottom: "1px" }}>주간 변화율</div><div style={{ fontSize: isMobile ? "0.9rem" : "1rem", fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: tool.change >= 0 ? "var(--color-green)" : "var(--color-red)" }}>{tool.change >= 0 ? "▲" : "▼"} {Math.abs(tool.change)}%</div></div>
            </div>
            <SparkChart data={generateSparkData(tool)} color={getScoreTextColor(tool.score)} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2px" }}><span style={{ fontSize: "0.55rem", color: "var(--text-muted)" }}>7일 전</span><span style={{ fontSize: "0.55rem", color: "var(--text-muted)" }}>오늘</span></div>
          </div>

          {tool.features && ( <div style={{ marginBottom: isMobile ? "16px" : "20px" }}><div style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: isMobile ? "8px" : "10px" }}>핵심 기능</div><ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: isMobile ? "5px" : "6px" }}>{tool.features.map((f, i) => ( <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}><span style={{ color: "var(--accent-indigo)", fontWeight: 700, fontSize: "0.75rem", marginTop: "1px", flexShrink: 0 }}>✓</span><span style={{ fontSize: isMobile ? "0.8rem" : "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>{f}</span></li>))}</ul></div>)}

          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: isMobile ? "16px" : "20px" }}>{tool.tags.filter(tag => tag !== "무료" && tag !== "유료").map((tag) => ( <span key={tag} style={{ fontSize: isMobile ? "0.62rem" : "0.65rem", padding: isMobile ? "2px 6px" : "3px 8px", borderRadius: "6px", background: "var(--tag-bg)", color: "var(--tag-color)", border: "1px solid var(--tag-border)", fontWeight: 500 }}>{tag}</span>))}</div>

          <div style={{ marginBottom: isMobile ? "16px" : "20px", display: "flex", flexDirection: "column", gap: isMobile ? "8px" : "10px" }}>
            {tool.cat && ( <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><span style={{ fontSize: "0.65rem", fontWeight: 600, color: "var(--text-muted)", flexShrink: 0 }}>카테고리</span><span style={{ fontSize: "0.68rem", padding: "3px 10px", borderRadius: "20px", background: "var(--accent-gradient)", color: "#fff", fontWeight: 600 }}>{CAT_LABEL[tool.cat] ?? tool.cat}</span></div>)}
            {tool.life?.length > 0 && ( <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}><span style={{ fontSize: "0.65rem", fontWeight: 600, color: "var(--text-muted)", flexShrink: 0 }}>추천 대상</span><div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>{tool.life.map((l) => ( <span key={l} style={{ fontSize: "0.65rem", padding: "3px 8px", borderRadius: "6px", background: "var(--bg-tertiary)", color: "var(--text-secondary)", border: "1px solid var(--border-primary)", fontWeight: 500 }}>{LIFE_LABEL[l] ?? l}</span>))}</div></div>)}
          </div>

          {tool.url && ( <a href={tool.url} target="_blank" rel="noopener noreferrer" style={{ display: "block", textAlign: "center", padding: isMobile ? "11px" : "12px", borderRadius: "12px", background: "linear-gradient(135deg, var(--accent-indigo), var(--accent-cyan))", color: "#fff", fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: isMobile ? "0.85rem" : "0.9rem", textDecoration: "none", transition: "opacity 0.2s ease" }} onMouseEnter={(e) => e.currentTarget.style.opacity = "0.85"} onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}>공식 사이트 바로가기 →</a>)}
        </div>

        {/* [오른쪽] 새로 추가된 심층 분석 카드 (디자인 개선됨) */}
        <ToolAnalysisCard tool={tool} />

      </div>
    </div>
  );
};

export default ToolDetailModal;
