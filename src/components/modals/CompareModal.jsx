const CompareModal = ({ tools, compareIds, onClose }) => {
  const compareTools = tools.filter((t) => compareIds.includes(t.id));
  if (compareTools.length < 2) return null;

  const maxScore = Math.max(...compareTools.map((t) => t.score));
  const maxChange = Math.max(...compareTools.map((t) => t.change));
  const maxX = Math.max(...compareTools.map((t) => t.sns.x));
  const maxGoogle = Math.max(...compareTools.map((t) => t.sns.google));
  const maxHn = Math.max(...compareTools.map((t) => t.sns.hn));
  const maxGithub = Math.max(...compareTools.map((t) => t.sns.github));

  const rows = [
    { label: "SNS 종합 점수", getValue: (t) => t.score, max: maxScore },
    { label: "주간 성장률", getValue: (t) => `${t.change >= 0 ? "+" : ""}${t.change}%`, max: null, rawGet: (t) => t.change, rawMax: maxChange },
    { label: "X (Twitter)", getValue: (t) => t.sns.x, max: maxX },
    { label: "Google", getValue: (t) => t.sns.google, max: maxGoogle },
    { label: "HackerNews", getValue: (t) => t.sns.hn, max: maxHn },
    { label: "GitHub", getValue: (t) => t.sns.github, max: maxGithub },
    { label: "가격", getValue: (t) => t.free ? "무료" : "유료", max: null },
  ];

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "var(--modal-overlay)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "fadeInUp 0.2s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg-card)",
          borderRadius: "20px",
          border: "1px solid var(--border-primary)",
          padding: "1.5rem",
          maxWidth: "720px",
          width: "90%",
          maxHeight: "80vh",
          overflow: "auto",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        {/* 모달 헤더 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
          <div>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.2rem", fontWeight: 700 }}>📊 도구 비교</h2>
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>선택한 AI 도구들의 점수를 비교합니다</p>
          </div>
          <button onClick={onClose} style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            border: "1px solid var(--border-primary)",
            background: "transparent",
            color: "var(--text-secondary)",
            cursor: "pointer",
            fontSize: "1rem",
          }}>✕</button>
        </div>

        {/* 비교 테이블 */}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "8px 12px", fontSize: "0.78rem", color: "var(--text-muted)", borderBottom: "1px solid var(--border-primary)" }}>항목</th>
              {compareTools.map((t) => (
                <th key={t.id} style={{ textAlign: "center", padding: "8px", fontSize: "0.85rem", fontWeight: 700, borderBottom: "1px solid var(--border-primary)", color: "var(--text-primary)" }}>
                  {t.icon} {t.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <td style={{ padding: "10px 12px", fontSize: "0.8rem", color: "var(--text-secondary)", borderBottom: "1px solid var(--border-primary)" }}>
                  {row.label}
                </td>
                {compareTools.map((t) => {
                  const val = row.getValue(t);
                  const isMax = row.max !== null
                    ? val === row.max
                    : row.rawGet
                      ? row.rawGet(t) === row.rawMax
                      : false;
                  return (
                    <td key={t.id} style={{
                      textAlign: "center",
                      padding: "10px 8px",
                      fontSize: "0.85rem",
                      fontWeight: isMax ? 700 : 400,
                      color: isMax ? "var(--accent-indigo)" : "var(--text-primary)",
                      borderBottom: "1px solid var(--border-primary)",
                    }}>
                      {isMax ? "🥇 " : ""}{val}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompareModal;
