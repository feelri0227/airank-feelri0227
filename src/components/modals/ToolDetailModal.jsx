import { useState, useEffect } from "react";
import { doc, deleteDoc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { getScoreTextColor, getRankBadge } from "../../utils";

// 점수 그래프 생성 함수 (기존 로직 유지)
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

// SNS 인기도 차트 컴포넌트
const SnsChart = ({ label, value, color, icon }) => (
  <div style={{ marginBottom: "12px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", fontSize: "0.8rem" }}>
      <span style={{ fontWeight: 600, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "6px" }}>
        {icon} {label}
      </span>
      <span style={{ fontWeight: 700, color: color }}>{value}%</span>
    </div>
    <div style={{ width: "100%", height: "8px", background: "var(--bg-tertiary)", borderRadius: "4px", overflow: "hidden" }}>
      <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: "4px" }} />
    </div>
  </div>
);

const ToolDetailModal = ({ tool, rank, onClose }) => {
  const [bookmarked, setBookmarked] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user, login } = useAuth();

  useEffect(() => {
    const checkRes = () => setIsMobile(window.innerWidth < 900); // 900px 미만은 모바일 모드 (세로 배치)
    checkRes();
    window.addEventListener('resize', checkRes);
    return () => window.removeEventListener('resize', checkRes);
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
        background: "rgba(0,0,0,0.6)", 
        display: "flex", alignItems: "center", justifyContent: "center", 
        padding: "20px", backdropFilter: "blur(8px)",
        overflowY: "auto" // 화면 작을 때 스크롤 가능
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          display: "flex", 
          flexDirection: isMobile ? "column" : "row", // 모바일은 세로, PC는 가로 배치
          gap: "16px",
          alignItems: "stretch", // 높이 맞춤 (내용물에 따라 달라질 수 있음)
          maxHeight: "90vh",
          overflowY: isMobile ? "auto" : "visible", // 모바일에서는 내부 스크롤
        }}
      >
        
        {/* [왼쪽] 기존 기본 정보 카드 */}
        <div style={{ 
          background: "var(--bg-card)", border: "1px solid var(--border-primary)", borderRadius: "24px", 
          padding: "1.5rem", width: "100%", maxWidth: "360px", minWidth: "320px",
          position: "relative", boxShadow: "0 20px 50px rgba(0,0,0,0.3)"
        }}>
          {/* 닫기 버튼 (모바일에서만 표시하거나, 우측 카드에 넣거나 선택 가능. 여기선 왼쪽 카드에 유지) */}
          <button onClick={onClose} style={{ position: "absolute", top: "16px", right: "16px", background: "var(--bg-tertiary)", border: "none", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", color: "var(--text-muted)", zIndex: 10 }}>✕</button>
          
          <button onClick={toggleBookmark} style={{ position: "absolute", top: "16px", right: "56px", background: bookmarked ? "rgba(239,68,68,0.1)" : "var(--bg-tertiary)", border: bookmarked ? "1px solid #ef4444" : "none", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", color: bookmarked ? "#ef4444" : "var(--text-muted)", zIndex: 10 }}>{bookmarked ? "♥" : "♡"}</button>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <span style={{ fontSize: "2.5rem" }}>{tool.icon}</span>
            <div><h2 style={{ margin: 0, fontWeight: 800 }}>{tool.name}</h2><div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)" }}>{getRankBadge(rank)}</div></div>
          </div>

          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "20px" }}>{tool.desc}</p>

          <div style={{ marginBottom: "20px", padding: "12px", background: "var(--bg-secondary)", borderRadius: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
              <div><div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>종합 점수</div><div style={{ fontSize: "1.8rem", fontWeight: 800, color: getScoreTextColor(tool.score) }}>{tool.score}</div></div>
              <div style={{ width: "1px", height: "30px", background: "var(--border-primary)" }} />
              <div><div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>주간 변화율</div><div style={{ fontSize: "1.1rem", fontWeight: 700, color: tool.change >= 0 ? "var(--color-green)" : "var(--color-red)" }}>{tool.change >= 0 ? "▲" : "▼"} {Math.abs(tool.change)}%</div></div>
            </div>
            <SparkChart data={generateSparkData(tool)} color={getScoreTextColor(tool.score)} />
          </div>

          <button onClick={() => window.open(tool.url, "_blank")} style={{ width: "100%", padding: "14px", borderRadius: "14px", background: "linear-gradient(135deg, var(--accent-indigo), var(--accent-cyan))", color: "#fff", border: "none", fontWeight: 700, cursor: "pointer", fontSize: "1rem" }}>공식 사이트 바로가기 →</button>
        </div>

        {/* [오른쪽] 심층 분석 카드 (SNS 차트) */}
        <div style={{ 
          background: "var(--bg-card)", border: "1px solid var(--border-primary)", borderRadius: "24px", 
          padding: "1.5rem", width: "100%", maxWidth: "360px", minWidth: "320px",
          display: "flex", flexDirection: "column",
          boxShadow: "0 20px 50px rgba(0,0,0,0.3)"
        }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "8px" }}>
            📊 실시간 인기도 분석
          </h3>

          <div style={{ padding: "16px", background: "var(--bg-secondary)", borderRadius: "16px", marginBottom: "auto" }}>
            <SnsChart label="Naver 검색" value={tool.sns?.naver || 0} color="#03C75A" icon="🇳" />
            <SnsChart label="YouTube 관심도" value={tool.sns?.youtube || 0} color="#FF0000" icon="▶" />
            <SnsChart label="Google 트렌드" value={tool.sns?.google || 0} color="#4285F4" icon="🇬" />
            <SnsChart label="GitHub 활동" value={tool.sns?.github || 0} color="#181717" icon="🐙" />
          </div>
          
          <div style={{ marginTop: "20px", padding: "12px", background: "var(--bg-tertiary)", borderRadius: "12px" }}>
             <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
               <strong>💡 AI 분석:</strong><br/>
               {tool.sns?.github > 50 
                 ? "이 도구는 개발자 커뮤니티에서 특히 인기가 높습니다. 기술적인 활용도가 높은 도구입니다." 
                 : "대중적인 관심도가 높은 도구입니다. 검색량과 영상 조회수가 꾸준히 상승하고 있습니다."}
             </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ToolDetailModal;
