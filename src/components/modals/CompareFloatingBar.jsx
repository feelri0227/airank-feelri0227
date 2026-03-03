const CompareFloatingBar = ({ tools, compareIds, onClear, onCompare }) => {
  const selectedTools = tools.filter((t) => compareIds.includes(t.id));

  if (compareIds.length < 2) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      background: "var(--bg-card)",
      border: "1px solid var(--border-primary)",
      borderRadius: "16px",
      padding: "12px 20px",
      display: "flex",
      alignItems: "center",
      gap: "16px",
      zIndex: 200,
      boxShadow: "var(--shadow-lg)",
      animation: "fadeInUp 0.3s ease",
    }}>
      {/* 선택된 도구 아이콘 */}
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        {selectedTools.map((t) => (
          <span key={t.id} style={{
            background: "var(--tag-bg)",
            padding: "4px 10px",
            borderRadius: "8px",
            fontSize: "0.78rem",
            fontWeight: 500,
            color: "var(--text-primary)",
          }}>
            {t.icon} {t.name}
          </span>
        ))}
      </div>

      {/* 버튼 그룹 */}
      <button onClick={onClear} style={{
        padding: "6px 12px",
        borderRadius: "8px",
        border: "1px solid var(--border-primary)",
        background: "transparent",
        color: "var(--text-secondary)",
        fontSize: "0.78rem",
        cursor: "pointer",
        fontFamily: "'Pretendard', sans-serif",
      }}>
        초기화
      </button>
      <button onClick={onCompare} style={{
        padding: "8px 16px",
        borderRadius: "8px",
        border: "none",
        background: "var(--accent-gradient)",
        color: "#fff",
        fontSize: "0.82rem",
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: "'Pretendard', sans-serif",
      }}>
        비교하기 {compareIds.length}개 →
      </button>
    </div>
  );
};

export default CompareFloatingBar;
