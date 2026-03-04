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
          // 뉴스 제목과 링크를 함께 저장
          setItems(data.items.map((n) => ({
            title: `📰 ${n.title}`,
            link: n.link,
          })));
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
          <a // <a> 태그로 변경
            key={i}
            href={item.link} // 링크 주소 설정
            target="_blank" // 새 탭에서 열기
            rel="noopener noreferrer" // 보안 속성
            style={{
              fontSize: "0.78rem",
              color: "var(--text-secondary)",
              fontWeight: 400,
              textDecoration: "none", // 밑줄 제거
            }}
          >
            {typeof item === 'string' ? item : item.title}
          </a>
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
