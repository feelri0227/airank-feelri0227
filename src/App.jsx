import { useState, useEffect, useMemo, useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";
import ToolContext from "./context/ToolContext";
import { useAuth } from "./context/AuthContext";

import MainLayout from "./layouts/MainLayout";
import MainPage from "./pages/MainPage";
import NewsPage from "./pages/News";
import ToolDetailModal from "./components/modals/ToolDetailModal";

import { TOOLS_DATA } from "./data/tools";

function ToolProvider({ children }) {
  const { user } = useAuth();
  const [tools, setTools] = useState(TOOLS_DATA);
  const [selectedTool, setSelectedTool] = useState(null);
  const [selectedRank, setSelectedRank] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [selectedArticle, setSelectedArticle] = useState(() => {
    const savedArticle = localStorage.getItem('selectedArticle');
    return savedArticle ? JSON.parse(savedArticle) : null;
  });
  const [news, setNews] = useState({ items: [], lastUpdated: '' });
  const [newsBookmarks, setNewsBookmarks] = useState([]);

  useEffect(() => {
    // (기존 fetch 로직들)

    if (user) {
      const q = query(collection(db, "newsBookmarks"), where("uid", "==", user.uid));
      const unsub = onSnapshot(q, (snap) => {
        setNewsBookmarks(snap.docs.map(d => ({...d.data(), id: d.id})))
      });
      return unsub;
    }
  }, [user]);

  const addNewsBookmark = useCallback(async (article) => {
    if (!user) return;
    await addDoc(collection(db, "newsBookmarks"), {
      uid: user.uid,
      ...article
    });
  }, [user]);

  const removeNewsBookmark = useCallback(async (bookmarkId) => {
    if (!user) return;
    await deleteDoc(doc(db, "newsBookmarks", bookmarkId));
  }, [user]);


  const isNewsBookmarked = useCallback((articleLink) => {
    return newsBookmarks.some(b => b.link === articleLink);
  }, [newsBookmarks]);

  const toggleNewsBookmark = useCallback((article) => {
    const existing = newsBookmarks.find(b => b.link === article.link);
    if (existing) {
      removeNewsBookmark(existing.id);
    } else {
      addNewsBookmark(article);
    }
  }, [newsBookmarks, addNewsBookmark, removeNewsBookmark]);

  const value = useMemo(() => ({ 
    tools, 
    openToolDetail,
    theme,
    toggleTheme,
    selectedArticle,
    setSelectedArticle,
    news,
    newsBookmarks,
    toggleNewsBookmark,
    isNewsBookmarked
  }), [tools, theme, selectedArticle, news, newsBookmarks, toggleNewsBookmark, isNewsBookmarked]);

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
  // ... (기존 App 컴포넌트)
}
