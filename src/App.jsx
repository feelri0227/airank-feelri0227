import { useState, useEffect, useCallback, useMemo } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ToolContext from "./context/ToolContext";

import MainLayout from "./layouts/MainLayout";
import MainPage from "./pages/MainPage";
import NewsPage from "./pages/News";
import ToolDetailModal from "./components/modals/ToolDetailModal";

import { TOOLS_DATA } from "./data/tools";

function ToolProvider({ children }) {
  const [tools, setTools] = useState(TOOLS_DATA);
  const [selectedTool, setSelectedTool] = useState(null);
  const [selectedRank, setSelectedRank] = useState(null);

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

  const openToolDetail = (tool, rank) => {
    setSelectedTool(tool);
    setSelectedRank(rank);
  };

  const closeToolDetail = () => {
    setSelectedTool(null);
  };

  const value = useMemo(() => ({ 
    tools, 
    openToolDetail 
  }), [tools]);

  return (
    <ToolContext.Provider value={value}>
      {children}
      <ToolDetailModal
        tool={selectedTool}
        rank={selectedRank}
        onClose={closeToolDetail}
      />
    </ToolContext.Provider>
  );
}

export default function App() {
  return (
    <ToolProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<MainPage />} />
            <Route path="news" element={<NewsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToolProvider>
  );
}
