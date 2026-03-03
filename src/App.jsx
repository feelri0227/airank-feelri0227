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
import CompareModal from "./components/modals/CompareModal";
import CompareFloatingBar from "./components/modals/CompareFloatingBar";
import WizardModal from "./components/modals/WizardModal";

import { TOOLS_DATA } from "./data/tools";

export default function App() {
  /* ── 전역 상태 ── */
  const [theme, setTheme] = useState("light");
  const [activeMenu, setActiveMenu] = useState("ranking");
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [lifeFilter, setLifeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("score");
  const [compareIds, setCompareIds] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [showWizard, setShowWizard] = useState(false);

  /* ── 테마 토글 ── */
  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  /* ── 비교 체크박스 토글 (최대 4개) ── */
  const toggleCompare = useCallback((id) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  }, []);

  /* ── 필터링 & 정렬된 도구 목록 (메모이제이션) ── */
  const filteredTools = useMemo(() => {
    let data = [...TOOLS_DATA];

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
  }, [category, lifeFilter, searchQuery, sortBy]);

  /* ── data-theme 속성 동기화 ── */
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

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

        {/* 메인 3단 레이아웃 (좌/중/우) */}
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
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "16px",
              }}>
                {filteredTools.map((tool, i) => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    rank={i + 1}
                    isComparing={compareIds.includes(tool.id)}
                    onToggleCompare={toggleCompare}
                  />
                ))}
              </div>
            )}
          </main>

          <RightSidebar />
        </div>

        <Footer />

        <CompareFloatingBar
          tools={TOOLS_DATA}
          compareIds={compareIds}
          onClear={() => setCompareIds([])}
          onCompare={() => setShowCompare(true)}
        />

        {showCompare && (
          <CompareModal
            tools={TOOLS_DATA}
            compareIds={compareIds}
            onClose={() => setShowCompare(false)}
          />
        )}

        <WizardModal
          isOpen={showWizard}
          onClose={() => setShowWizard(false)}
          tools={TOOLS_DATA}
        />
      </div>
    </>
  );
}
