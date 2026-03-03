const SnsScoreBars = ({ sns }) => {
  const platforms = [
    { key: "x", label: "X", color: "#1da1f2" },
    { key: "reddit", label: "Reddit", color: "#ff4500" },
    { key: "hn", label: "HN", color: "#ff6600" },
    { key: "github", label: "GitHub", color: "#8b5cf6" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "8px" }}>
      {platforms.map((p) => (
        <div key={p.key} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", width: "38px", textAlign: "right" }}>
            {p.label}
          </span>
          <div style={{
            flex: 1,
            height: "4px",
            background: "var(--border-primary)",
            borderRadius: "2px",
            overflow: "hidden",
          }}>
            <div style={{
              width: `${sns[p.key]}%`,
              height: "100%",
              background: p.color,
              borderRadius: "2px",
              transition: "width 0.6s ease",
            }} />
          </div>
          <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", width: "22px" }}>
            {sns[p.key]}
          </span>
        </div>
      ))}
    </div>
  );
};

export default SnsScoreBars;
