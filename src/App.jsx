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

// ToolModalWrapper: Context를 사용하여 모달 상태를 제어하는 컴포넌트
const ToolModalWrapper = () => {
  const { selectedTool, selectedRank, closeToolDetail } = useTools();

  return (
    <ToolDetailModal
      tool={selectedTool}
      rank={selectedRank}
      onClose={closeToolDetail}
    />
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
          <ToolModalWrapper />
        </BrowserRouter>
      </ToolProvider>
    </AuthProvider>
  );
}
