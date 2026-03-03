const HeroSection = ({ searchQuery, onSearchChange, onOpenWizard }) => (
  <section style={{
    textAlign: "center",
    padding: "3.5rem 2rem 2rem",
    position: "relative",
    zIndex: 5,
  }}>
    {/* 슬로건 배지 */}
    <div style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "0.72rem",
      letterSpacing: "0.15em",
      textTransform: "uppercase",
      color: "var(--accent-indigo)",
      fontWeight: 600,
      marginBottom: "1.2rem",
    }}>
      <span style={{ height: "1px", width: "28px", background: "var(--accent-indigo)", opacity: 0.4, display: "inline-block" }} />
      WHAT AI DO YOU USE?
      <span style={{ height: "1px", width: "28px", background: "var(--accent-indigo)", opacity: 0.4, display: "inline-block" }} />
    </div>

    {/* 메인 타이틀 */}
    <h1 style={{
      fontFamily: "'Outfit', sans-serif",
      fontSize: "clamp(1.4rem, 4.5vw, 3.5rem)",
      fontWeight: 800,
      lineHeight: 1.1,
      letterSpacing: "-0.04em",
      marginBottom: "0.8rem",
      color: "var(--text-primary)",
    }}>
      AI 도구를{" "}
      <span style={{
        background: "var(--accent-gradient)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}>
        진짜 인기
      </span>
      로 평가하다
    </h1>

    {/* 서브 설명 */}
    <p style={{
      color: "var(--text-secondary)",
      fontSize: "0.95rem",
      lineHeight: 1.6,
      marginBottom: "1.8rem",
      maxWidth: "480px",
      marginLeft: "auto",
      marginRight: "auto",
    }}>
      실제 검색량과 트래픽 기반으로
      <br />AI 도구의 진짜 순위를 확인하세요
    </p>

    {/* 검색 바 + 마법사 버튼 */}
    <div style={{
      display: "flex",
      gap: "10px",
      maxWidth: "560px",
      margin: "0 auto",
      alignItems: "center",
    }}>
      <div style={{ flex: 1, position: "relative" }}>
        <span style={{
          position: "absolute",
          left: "14px",
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: "1rem",
          opacity: 0.5,
        }}>🔍</span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="AI 도구 이름으로 검색..."
          style={{
            width: "100%",
            padding: "12px 16px 12px 42px",
            borderRadius: "12px",
            border: "1px solid var(--border-primary)",
            background: "var(--bg-card)",
            color: "var(--text-primary)",
            fontFamily: "'Pretendard', sans-serif",
            fontSize: "0.9rem",
            outline: "none",
            transition: "border-color 0.2s",
            boxShadow: "var(--shadow-sm)",
          }}
        />
      </div>
      <button
        onClick={onOpenWizard}
        style={{
          padding: "12px 20px",
          borderRadius: "12px",
          border: "none",
          background: "var(--accent-gradient)",
          color: "#fff",
          fontFamily: "'Pretendard', sans-serif",
          fontSize: "0.85rem",
          fontWeight: 600,
          cursor: "pointer",
          whiteSpace: "nowrap",
          boxShadow: "0 4px 14px rgba(99, 102, 241, 0.3)",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
      >
        ✨ 나에게 딱 맞는 AI 찾기
      </button>
    </div>
  </section>
);

export default HeroSection;
