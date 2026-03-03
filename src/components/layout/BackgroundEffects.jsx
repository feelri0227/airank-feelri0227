const BackgroundEffects = () => (
  <>
    {/* 글로우 블롭 - 인디고 */}
    <div style={{
      position: "fixed",
      width: "500px",
      height: "500px",
      borderRadius: "50%",
      background: "#6366f1",
      filter: "blur(140px)",
      opacity: "var(--blob-opacity)",
      top: "-150px",
      right: "-100px",
      pointerEvents: "none",
      zIndex: 0,
    }} />
    {/* 글로우 블롭 - 시안 */}
    <div style={{
      position: "fixed",
      width: "400px",
      height: "400px",
      borderRadius: "50%",
      background: "#06b6d4",
      filter: "blur(140px)",
      opacity: "var(--blob-opacity)",
      bottom: "-100px",
      left: "-100px",
      pointerEvents: "none",
      zIndex: 0,
    }} />
  </>
);

export default BackgroundEffects;
