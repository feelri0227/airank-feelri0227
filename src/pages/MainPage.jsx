import { useState, useEffect, useMemo } from "react";
import { useTools } from "../context/ToolContext";

import FilterBar from "../components/filters/FilterBar";
import RightSidebar from "../components/sidebar/RightSidebar";
import ToolCard from "../components/tools/ToolCard";
import WizardModal from "../components/modals/WizardModal";
import HeroSection from "../components/hero/HeroSection";
import { SORT_OPTIONS } from "../constants";

export default function MainPage() {
  const { tools, openToolDetail, bookmarkCounts } = useTools();
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [lifeFilter, setLifeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("score");
  const [showWizard, setShowWizard] = useState(false);
  const getInitialCount = () => (window.innerWidth >= 768 ? 20 : 10);
  const [visibleCount, setVisibleCount] = useState(getInitialCount);

  const filteredTools = useMemo(() => {
    let data = [...tools];

    if (category !== "all") {
      data = data.filter((t) => t.cat === category);
    }
    if (lifeFilter !== "all") {
      data = data.filter((t) => t.life.includes(lifeFilter));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter(
        (t) =>
          t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q)
      );
    }

    if (sortBy === "score") data.sort((a, b) => b.score - a.score);
    else if (sortBy === "bookmark") data.sort((a, b) => (bookmarkCounts[b.id] || 0) - (bookmarkCounts[a.id] || 0));
    else data.sort((a, b) => a.name.localeCompare(b.name, "ko"));

    return data;
  }, [tools, category, lifeFilter, searchQuery, sortBy, bookmarkCounts]);

  useEffect(() => {
    setVisibleCount(getInitialCount());
  }, [category, lifeFilter, searchQuery, sortBy]);

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

      <div className="main-grid">
        <main>
          {/* 정렬 버튼 - 우측 정렬 */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "2px", marginBottom: "12px" }}>
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSortBy(opt.id)}
                style={{
                  padding: "4px 10px",
                  borderRadius: "6px",
                  border: "none",
                  background: sortBy === opt.id ? "var(--bg-tertiary)" : "transparent",
                  color: sortBy === opt.id ? "var(--text-primary)" : "var(--text-muted)",
                  fontSize: "0.75rem",
                  fontFamily: "'Pretendard', sans-serif",
                  fontWeight: sortBy === opt.id ? 600 : 400,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {filteredTools.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "4rem 2rem",
                color: "var(--text-muted)",
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>🤖</div>
              <p style={{ fontSize: "1rem", fontWeight: 500 }}>
                검색 결과가 없습니다
              </p>
              <p style={{ fontSize: "0.82rem", marginTop: "4px" }}>
                다른 키워드나 필터로 검색해보세요
              </p>
            </div>
          ) : (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "16px",
                }}
              >
                {filteredTools.slice(0, visibleCount).map((tool, i) => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    rank={i + 1}
                    onClick={() => openToolDetail(tool, i + 1)}
                  />
                ))}
              </div>
              {filteredTools.length > visibleCount && (
                <div style={{ textAlign: "center", marginTop: "24px" }}>
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 10)}
                    style={{
                      padding: "10px 32px",
                      borderRadius: "10px",
                      border: "1px solid var(--border-primary)",
                      background: "var(--bg-card)",
                      color: "var(--text-primary)",
                      fontFamily: "'Pretendard', sans-serif",
                      fontSize: "0.88rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    더보기 ({filteredTools.length - visibleCount}개 더 있음)
                  </button>
                </div>
              )}
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
