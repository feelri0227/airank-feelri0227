import { useState, useEffect } from "react";

const FALLBACK_NEWS = [
  { title: "OpenAI, GPT-5 출시 임박 소문", link: "https://search.naver.com/search.naver?where=news&query=GPT-5", relativeTime: "2시간 전", hot: true },
  { title: "Anthropic Claude 4 벤치마크 공개", link: "https://search.naver.com/search.naver?where=news&query=Claude+AI", relativeTime: "5시간 전", hot: true },
  { title: "Midjourney 웹앱 정식 출시", link: "https://search.naver.com/search.naver?where=news&query=Midjourney", relativeTime: "8시간 전", hot: true },
  { title: "Google Gemini 2.0 Flash 업데이트", link: "https://search.naver.com/search.naver?where=news&query=Gemini+AI", relativeTime: "12시간 전", hot: false },
  { title: "Cursor IDE, 월 사용자 100만 돌파", link: "https://search.naver.com/search.naver?where=news&query=Cursor+IDE", relativeTime: "1일 전", hot: false },
];

const popularTags = ["텍스트 생성", "이미지 생성", "코딩", "무료", "API", "오픈소스", "영상 생성", "생산성"];

const RightSidebar = () => {
  const [news, setNews] = useState(FALLBACK_NEWS);

  useEffect(() => {
    fetch("/news.json")
      .then((r) => r.json())
      .then((data) => {
        if (data.items?.length) setNews(data.items.slice(0, 5));
      })
      .catch(() => {}); // 폴백 유지
  }, []);

  return (
    <aside className="sidebar-right" style={{
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      minWidth: "220px",
    }}>
      {/* 뉴스 피드 */}
      <div style={{
        background: "var(--bg-card)",
        borderRadius: "16px",
        border: "1px solid var(--border-primary)",
        padding: "1.2rem",
        boxShadow: "var(--shadow-card)",
      }}>
        <h3 style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: "0.9rem",
          fontWeight: 700,
          marginBottom: "12px",
          color: "var(--text-primary)",
        }}>
          📰 최신 뉴스
        </h3>
        {news.map((item, i) => (
          <a
            key={i}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              padding: "8px 0",
              borderBottom: i < news.length - 1 ? "1px solid var(--border-primary)" : "none",
              textDecoration: "none",
            }}
          >
            <div style={{
              fontSize: "0.8rem",
              fontWeight: 500,
              color: "var(--text-primary)",
              lineHeight: 1.4,
              display: "flex",
              gap: "4px",
              alignItems: "flex-start",
            }}>
              {item.title}
            </div>
            <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "2px" }}>
              {item.relativeTime}
            </div>
          </a>
        ))}
      </div>

      {/* 인기 태그 */}
      <div style={{
        background: "var(--bg-card)",
        borderRadius: "16px",
        border: "1px solid var(--border-primary)",
        padding: "1.2rem",
        boxShadow: "var(--shadow-card)",
      }}>
        <h3 style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: "0.9rem",
          fontWeight: 700,
          marginBottom: "12px",
          color: "var(--text-primary)",
        }}>
          🏷️ 인기 태그
        </h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {popularTags.map((tag) => (
            <span key={tag} style={{
              fontSize: "0.72rem",
              padding: "4px 10px",
              borderRadius: "100px",
              background: "var(--tag-bg)",
              color: "var(--tag-color)",
              border: `1px solid var(--tag-border)`,
              cursor: "pointer",
              transition: "all 0.2s",
              fontWeight: 500,
            }}>
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
