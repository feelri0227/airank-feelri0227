const Footer = () => (
  <footer style={{
    textAlign: "center",
    padding: "2rem 1.5rem",
    borderTop: "1px solid var(--border-primary)",
    marginTop: "3rem",
  }}>
    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
      데이터 출처: X API · Google Trends · HackerNews · GitHub Trending ·{" "}
      <span style={{ color: "var(--accent-indigo)", fontWeight: 600 }}>AI뭐써?</span> 자체 분석
    </p>
    <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "4px" }}>
      © 2026 AI뭐써? All rights reserved. 모든 점수는 참고용입니다.
    </p>
  </footer>
);

export default Footer;
