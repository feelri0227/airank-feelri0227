import { useState, useEffect, useMemo } from "react";
import { useTools } from "../context/ToolContext";
import { useNews } from "../context/NewsContext";

import FilterBar from "../components/filters/FilterBar";
import LeftSidebar from "../components/sidebar/LeftSidebar";
import RightSidebar from "../components/sidebar/RightSidebar";
import ToolCard from "../components/tools/ToolCard";
import WizardModal from "../components/modals/WizardModal";
import HeroSection from "../components/hero/HeroSection";
import { SORT_OPTIONS } from "../constants";

export default function MainPage() {
  const { tools, openToolDetail, bookmarkCounts, reactionCounts } = useTools();
  const { news } = useNews();
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [lifeFilter, setLifeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("score_desc");
  const [showWizard, setShowWizard] = useState(false);
  
  // 초기 개수 10개로 설정
  const [visibleCount, setVisibleCount] = useState(10);

  const filteredTools = useMemo(() => {
    let data = [...tools];
    if (category !== "all") data = data.filter((t) => t.cat === category);
    if (lifeFilter !== "all") data = data.filter((t) => t.life.includes(lifeFilter));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter((t) => 
        t.name.toLowerCase().includes(q) || 
        (t.nameKo && t.nameKo.includes(q)) || 
        t.desc.toLowerCase().includes(q)
      );
    }
    if (sortBy === "score_desc") data.sort((a, b) => b.score - a.score);
    else if (sortBy === "score_asc") data.sort((a, b) => a.score - b.score);
    else if (sortBy === "bookmark") data.sort((a, b) => (bookmarkCounts[b.id] || 0) - (bookmarkCounts[a.id] || 0));
    else if (sortBy === "likes") data.sort((a, b) => (reactionCounts[b.id]?.likes || 0) - (reactionCounts[a.id]?.likes || 0));
    else if (sortBy === "dislikes") data.sort((a, b) => (reactionCounts[b.id]?.dislikes || 0) - (reactionCounts[a.id]?.dislikes || 0));
    else data.sort((a, b) => a.name.localeCompare(b.name, "ko"));
    return data;
  }, [tools, category, lifeFilter, searchQuery, sortBy, bookmarkCounts, reactionCounts]);

  useEffect(() => {
    setVisibleCount(10);
  }, [category, lifeFilter, searchQuery, sortBy]);

  // 모바일 전용 뉴스 섹션 컴포넌트
  const MobileNewsSection = () => {
    if (!news || !news.items) return null;
    
    return (
      <div className="mobile-news-box">
        <div className="mobile-news-header">
          <span style={{ fontSize: "0.95rem", fontWeight: 700 }}>📰 실시간 주요 뉴스</span>
          <a href="/news" style={{ fontSize: "0.75rem", color: "var(--accent-indigo)", textDecoration: "none", fontWeight: 600 }}>전체보기 ❯</a>
        </div>
        <div className="mobile-news-list">
          {news.items.slice(0, 5).map((item, idx) => (
            <a key={idx} href={item.link} target="_blank" rel="noopener noreferrer" className="mobile-news-item">
              <span className="dot">•</span> 
              <span className="title">{item.title}</span>
            </a>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <HeroSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenWizard={() => setShowWizard(true)}
      />

      <FilterBar
        category={category}
        onCategoryChange={setCategory}
        lifeFilter={lifeFilter}
        onLifeFilterChange={setLifeFilter}
      />

      <div className="main-grid" style={{
        display: "grid",
        gridTemplateColumns: "240px 1fr 380px",
        gap: "24px",
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "0 1.5rem",
        alignItems: "flex-start"
      }}>
        <LeftSidebar tools={tools} />

        <main style={{ minWidth: 0 }}>
          <div className="sort-container">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSortBy(opt.id)}
                className={`sort-btn ${sortBy === opt.id ? "active" : ""}`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {filteredTools.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--text-muted)" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>🤖</div>
              <p style={{ fontSize: "1rem", fontWeight: 500 }}>검색 결과가 없습니다</p>
            </div>
          ) : (
            <>
              {/* 1. 툴 카드 리스트 */}
              <div className="tools-grid">
                {filteredTools.slice(0, visibleCount).map((tool, i) => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    rank={i + 1}
                    onClick={() => openToolDetail(tool, i + 1)}
                  />
                ))}
              </div>

              {/* 2. 더보기 버튼 (툴 리스트 바로 아래) */}
              {filteredTools.length > visibleCount && (
                <div style={{ textAlign: "center", marginTop: "24px", marginBottom: "32px" }}>
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 10)}
                    style={{
                      padding: "12px 48px",
                      borderRadius: "14px",
                      border: "1px solid var(--border-primary)",
                      background: "var(--bg-card)",
                      color: "var(--text-primary)",
                      fontFamily: "'Pretendard', sans-serif",
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      boxShadow: "var(--shadow-sm)",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-tertiary)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "var(--bg-card)"}
                  >
                    순위 더보기 ({filteredTools.length - visibleCount}개 남음)
                  </button>
                </div>
              )}

              {/* 3. 뉴스 섹션 (더보기 버튼 아래) */}
              <MobileNewsSection />
            </>
          )}
        </main>

        <RightSidebar />
      </div>

      <WizardModal
        isOpen={showWizard}
        onClose={() => setShowWizard(false)}
        tools={tools}
      />
    </>
  );
}
