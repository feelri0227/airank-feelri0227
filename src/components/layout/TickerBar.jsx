import { useState, useEffect } from "react";
import { TICKER_ITEMS } from "../../constants";

const TickerBar = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [items, setItems] = useState(TICKER_ITEMS);

  useEffect(() => {
    fetch("/news.json")
      .then((r) => r.json())
      .then((data) => {
        if (data.items?.length) {
          // 뉴스 제목을 티커 형식으로 변환
          setItems(data.items.map((n) => `📰 ${n.title}`));
        }
      })
      .catch(() => {}); // 폴백: 하드코딩 TICKER_ITEMS 유지
  }, []);

  const doubled = [...items, ...items]; // 무한 스크롤용 2배 복제

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        background: "var(--ticker-bg)",
        borderBottom: "1px solid var(--ticker-border)",
        overflow: "hidden",
        height: "36px",
        display: "flex",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* 좌측 라벨 */}
      <div style={{
        padding: "0 12px",
        fontSize: "0.7rem",
        fontWeight: 600,
        color: "var(--accent-indigo)",
        whiteSpace: "nowrap",
        zIndex: 2,
        background: "var(--ticker-bg)",
      }}>
        📡 LIVE
      </div>

      {/* 스크롤 트랙 */}
      <div style={{
        display: "flex",
        gap: "3rem",
        whiteSpace: "nowrap",
        animation: "tickerScroll 40s linear infinite",
        animationPlayState: isPaused ? "paused" : "running",
      }}>
        {doubled.map((item, i) => (
          <span key={i} style={{
            fontSize: "0.78rem",
            color: "var(--text-secondary)",
            fontWeight: 400,
          }}>
            {item}
          </span>
        ))}
      </div>

      {/* 양쪽 페이드 효과 */}
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: "60px",
        background: `linear-gradient(to right, var(--bg-primary), transparent)`,
        zIndex: 1,
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute",
        right: 0,
        top: 0,
        bottom: 0,
        width: "60px",
        background: `linear-gradient(to left, var(--bg-primary), transparent)`,
        zIndex: 1,
        pointerEvents: "none",
      }} />
    </div>
  );
};

export default TickerBar;
