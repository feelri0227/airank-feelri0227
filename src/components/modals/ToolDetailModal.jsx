import { useState, useEffect } from "react";
import { doc, deleteDoc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { useTools } from "../../context/ToolContext"; // 추가
import { getScoreTextColor, getRankBadge } from "../../utils";

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
    </svg>
  );
};

const ToolDetailModal = ({ tool, rank, onClose }) => {
  const [bookmarked, setBookmarked] = useState(false);
  const { user, login } = useAuth();
  const { openAnalysis } = useTools(); // 추가

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
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", backdropFilter: "blur(4px)" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--bg-card)", border: "1px solid var(--border-primary)", borderRadius: "20px", padding: "1.25rem", width: "100%", maxWidth: "340px", position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: "16px", right: "16px", background: "var(--bg-tertiary)", border: "none", borderRadius: "8px", width: "32px", height: "32px", cursor: "pointer", color: "var(--text-muted)" }}>✕</button>
        <button onClick={toggleBookmark} style={{ position: "absolute", top: "16px", right: "56px", background: bookmarked ? "rgba(239,68,68,0.1)" : "var(--bg-tertiary)", border: bookmarked ? "1px solid #ef4444" : "none", borderRadius: "8px", width: "32px", height: "32px", cursor: "pointer", color: bookmarked ? "#ef4444" : "var(--text-muted)" }}>{bookmarked ? "♥" : "♡"}</button>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
          <span style={{ fontSize: "2.2rem" }}>{tool.icon}</span>
          <div><h2 style={{ margin: 0, fontWeight: 800 }}>{tool.name}</h2><div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)" }}>{getRankBadge(rank)}</div></div>
        </div>

        <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "20px" }}>{tool.desc}</p>

        <div style={{ marginBottom: "14px", padding: "10px 12px", background: "var(--bg-secondary)", borderRadius: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <div><div style={{ fontSize: "0.6rem", color: "var(--text-muted)" }}>종합 점수</div><div style={{ fontSize: "1.6rem", fontWeight: 800, color: getScoreTextColor(tool.score) }}>{tool.score}</div></div>
            <div style={{ width: "1px", height: "30px", background: "var(--border-primary)" }} />
            <div><div style={{ fontSize: "0.6rem", color: "var(--text-muted)" }}>주간 변화율</div><div style={{ fontSize: "1rem", fontWeight: 700, color: tool.change >= 0 ? "var(--color-green)" : "var(--color-red)" }}>{tool.change >= 0 ? "▲" : "▼"} {Math.abs(tool.change)}%</div></div>
          </div>
          <SparkChart data={generateSparkData(tool)} color={getScoreTextColor(tool.score)} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
          {/* 공식 사이트 버튼 */}
          <button onClick={() => window.open(tool.url, "_blank")} style={{ width: "100%", padding: "12px", borderRadius: "12px", background: "linear-gradient(135deg, var(--accent-indigo), var(--accent-cyan))", color: "#fff", border: "none", fontWeight: 700, cursor: "pointer" }}>공식 사이트 바로가기 →</button>
          
          {/* 심층 분석 버튼 추가 */}
          <button 
            onClick={() => { onClose(); openAnalysis(tool, rank); }} 
            style={{ 
              width: "100%", padding: "12px", borderRadius: "12px", 
              background: "var(--bg-tertiary)", color: "var(--text-primary)", 
              border: "1px solid var(--border-primary)", fontWeight: 700, cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            📊 SNS 인기도 & 심층 분석
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToolDetailModal;
