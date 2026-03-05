import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToolProvider } from "./context/ToolProvider";
import { useTools } from "./context/ToolContext";

import MainLayout from "./layouts/MainLayout";
import MainPage from "./pages/MainPage";
import NewsPage from "./pages/News";
import Community from "./pages/Community";
import CommunityPost from "./pages/CommunityPost";
import CommunityWrite from "./pages/CommunityWrite";
import ToolDetailModal from "./components/modals/ToolDetailModal";
import ToolAnalysisModal from "./components/modals/ToolAnalysisModal"; // 추가

const ModalWrapper = () => {
  const { 
    selectedTool, selectedRank, closeToolDetail,
    analysisTool, analysisRank, closeAnalysis 
  } = useTools();

  return (
    <>
      {selectedTool && (
        <ToolDetailModal
          tool={selectedTool}
          rank={selectedRank}
          onClose={closeToolDetail}
        />
      )}
      {analysisTool && (
        <ToolAnalysisModal
          tool={analysisTool}
          rank={analysisRank}
          onClose={closeAnalysis}
        />
      )}
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ToolProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<MainPage />} />
              <Route path="news" element={<NewsPage />} />
              <Route path="community" element={<Community />} />
              <Route path="community/write" element={<CommunityWrite />} />
              <Route path="community/:postId" element={<CommunityPost />} />
              <Route path="community/:postId/edit" element={<CommunityWrite />} />
            </Route>
          </Routes>
          <ModalWrapper />
        </BrowserRouter>
      </ToolProvider>
    </AuthProvider>
  );
}
