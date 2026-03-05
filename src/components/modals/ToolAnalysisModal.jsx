import { createPortal } from "react-dom";
import { getRankBadge } from "../../utils";

const ToolAnalysisModal = ({ tool, rank, onClose }) => {
  if (!tool) return null;

  // SNS 인기도 시각화 컴포넌트
  const SnsChart = ({ label, value, color, icon }) => (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "0.85rem" }}>
        <span style={{ fontWeight: 600, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "6px" }}>
          {icon} {label}
        </span>
        <span style={{ fontWeight: 700, color: color }}>{value}%</span>
      </div>
      <div style={{ width: "100%", height: "10px", background: "var(--bg-tertiary)", borderRadius: "6px", overflow: "hidden" }}>
        <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: "6px" }} />
      </div>
    </div>
  );

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1100,
        background: "rgba(0,0,0,0.65)", display: "flex",
        alignItems: "center", justifyContent: "center", padding: "16px",
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg-card)", border: "1px solid var(--border-primary)",
          borderRadius: "24px", padding: "1.5rem", width: "100%", maxWidth: "400px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.5)", position: "relative",
          maxHeight: "85vh", overflowY: "auto"
        }}
      >
        <button onClick={onClose} style={{
          position: "absolute", top: "16px", right: "16px",
          background: "var(--bg-tertiary)", border: "none", borderRadius: "50%",
          width: "32px", height: "32px", cursor: "pointer", color: "var(--text-muted)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>✕</button>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <span style={{ fontSize: "2.5rem" }}>{tool.icon}</span>
          <div>
            <h2 style={{ margin: 0, fontWeight: 800, fontSize: "1.5rem" }}>{tool.name}</h2>
            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)", marginTop: "4px" }}>
              심층 분석 리포트 {getRankBadge(rank)}
            </div>
          </div>
        </div>

        <h3 style={{ fontSize: "1rem", marginBottom: "1.2rem", color: "var(--text-primary)" }}>📊 SNS 트렌드 분석</h3>
        
        <div style={{ padding: "1rem", background: "var(--bg-secondary)", borderRadius: "16px", marginBottom: "1.5rem" }}>
          <SnsChart label="Naver 검색" value={tool.sns?.naver || 0} color="#03C75A" icon="🇳" />
          <SnsChart label="YouTube 관심도" value={tool.sns?.youtube || 0} color="#FF0000" icon="▶" />
          <SnsChart label="Google 트렌드" value={tool.sns?.google || 0} color="#4285F4" icon="🇬" />
          <SnsChart label="GitHub 활동" value={tool.sns?.github || 0} color="#181717" icon="🐙" />
        </div>

        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "1.5rem" }}>
          * 위 데이터는 각 플랫폼에서의 검색량, 조회수, 언급량을 종합하여 산출된 <strong>실시간 인기 지표</strong>입니다.
        </p>

        <button 
          onClick={() => window.open(tool.url, "_blank")}
          style={{
            width: "100%", padding: "14px", borderRadius: "14px",
            background: "linear-gradient(135deg, var(--accent-indigo), var(--accent-cyan))",
            color: "#fff", border: "none", fontWeight: 700, fontSize: "1rem", cursor: "pointer"
          }}
        >
          공식 사이트 바로가기 →
        </button>
      </div>
    </div>,
    document.body
  );
};

export default ToolAnalysisModal;
