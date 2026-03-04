import { useState, useEffect, useCallback, useMemo } from "react";

import GlobalStyles from "./styles/GlobalStyles";
import BackgroundEffects from "./components/layout/BackgroundEffects";
import Navbar from "./components/layout/Navbar";
import TickerBar from "./components/layout/TickerBar";
import Footer from "./components/layout/Footer";
import HeroSection from "./components/hero/HeroSection";
import FilterBar from "./components/filters/FilterBar";
import LeftSidebar from "./components/sidebar/LeftSidebar";
import RightSidebar from "./components/sidebar/RightSidebar";
import ToolCard from "./components/tools/ToolCard";
import WizardModal from "./components/modals/WizardModal";
import ToolDetailModal from "./components/modals/ToolDetailModal";

import { TOOLS_DATA } from "./data/tools";

export default function App() {
  const [theme, setTheme] = useState("light");
  const [activeMenu, setActiveMenu] = useState("ranking");
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [lifeFilter, setLifeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("score");
  const [showWizard, setShowWizard] = useState(false);
  const getInitialCount = () => window.innerWidth >= 768 ? 20 : 10;
  const [visibleCount, setVisibleCount] = useState(getInitialCount);
  const [selectedTool, setSelectedTool] = useState(null);
  const [selectedRank, setSelectedRank] = useState(null);
  const [tools, setTools] = useState(TOOLS_DATA);

  // scores.json에서 실시간 점수 로드 (없으면 하드코딩 값 유지)
  useEffect(() => {
    fetch("/scores.json")
      .then((r) => r.json())
      .then((data) => {
        if (!data?.tools) return;
        setTools((prev) =>
          prev.map((tool) => {
            const live = data.tools[String(tool.id)];
            return live ? { ...tool, ...live } : tool;
          })
        );
      })
      .catch(() => {});
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

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
        (t) => t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q)
      );
    }

    if (sortBy === "score") data.sort((a, b) => b.score - a.score);
    else if (sortBy === "growth") data.sort((a, b) => b.change - a.change);
    else data.sort((a, b) => a.name.localeCompare(b.name, "ko"));

    return data;
  }, [tools, category, lifeFilter, searchQuery, sortBy]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    setVisibleCount(getInitialCount());
  }, [category, lifeFilter, searchQuery, sortBy]);

  return (
    <>
      <GlobalStyles />
      <BackgroundEffects />

      <div style={{
        position: "relative",
        zIndex: 1,
        minHeight: "100vh",
        background: "var(--bg-primary)",
        transition: "background 0.35s ease",
      }}>
        <Navbar
          theme={theme}
          onToggleTheme={toggleTheme}
          activeMenu={activeMenu}
          onMenuChange={setActiveMenu}
          tools={tools}
          onOpenTool={(tool, rank) => { setSelectedTool(tool); setSelectedRank(rank); }}
        />

        <TickerBar />

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
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        <div className="main-grid">
          <LeftSidebar tools={filteredTools} />

          <main>
            {filteredTools.length === 0 ? (
              <div style={{
                textAlign: "center",
                padding: "4rem 2rem",
                color: "var(--text-muted)",
              }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>🤖</div>
                <p style={{ fontSize: "1rem", fontWeight: 500 }}>검색 결과가 없습니다</p>
                <p style={{ fontSize: "0.82rem", marginTop: "4px" }}>다른 키워드나 필터로 검색해보세요</p>
              </div>
            ) : (
              <>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "16px",
                }}>
                  {filteredTools.slice(0, visibleCount).map((tool, i) => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      rank={i + 1}
                      onClick={() => { setSelectedTool(tool); setSelectedRank(i + 1); }}
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

        <Footer />

        <WizardModal
          isOpen={showWizard}
          onClose={() => setShowWizard(false)}
          tools={tools}
        />

        <ToolDetailModal
          tool={selectedTool}
          rank={selectedRank}
          onClose={() => setSelectedTool(null)}
        />
      </div>
    </>
  );
}
