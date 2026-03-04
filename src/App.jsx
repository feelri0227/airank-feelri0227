import { useState, useEffect, useMemo, useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import ToolContext from "./context/ToolContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

import MainLayout from "./layouts/MainLayout";
import MainPage from "./pages/MainPage";
import NewsPage from "./pages/News";
import Community from "./pages/Community";
import CommunityPost from "./pages/CommunityPost";
import CommunityWrite from "./pages/CommunityWrite";
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
  const [bookmarkCounts, setBookmarkCounts] = useState({});
  const [toolReactions, setToolReactions] = useState([]);

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

    fetch('/news.json')
      .then((res) => res.json())
      .then((data) => setNews(data));
  }, []);

  useEffect(() => {
    getDocs(collection(db, "bookmarks"))
      .then((snap) => {
        const counts = {};
        snap.docs.forEach((d) => {
          const { toolId } = d.data();
          if (toolId) counts[toolId] = (counts[toolId] || 0) + 1;
        });
        setBookmarkCounts(counts);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, "newsBookmarks"), where("uid", "==", user.uid));
      const unsub = onSnapshot(q, (snap) => {
        setNewsBookmarks(snap.docs.map(d => ({...d.data(), id: d.id})))
      });
      return unsub;
    } else {
      setNewsBookmarks([]);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, "toolReactions"), where("uid", "==", user.uid));
      const unsub = onSnapshot(q, (snap) => {
        setToolReactions(snap.docs.map(d => d.data()));
      });
      return unsub;
    } else {
      setToolReactions([]);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (selectedArticle) {
      localStorage.setItem('selectedArticle', JSON.stringify(selectedArticle));
    } else {
      localStorage.removeItem('selectedArticle');
    }
  }, [selectedArticle]);

  const toggleTheme = () => {
    setTheme((prev) => prev === 'light' ? 'dark' : prev === 'dark' ? 'manus' : prev === 'manus' ? 'mono' : 'light');
  };

  const selectTheme = (newTheme) => setTheme(newTheme);

  const openToolDetail = (tool, rank) => {
    setSelectedTool(tool);
    setSelectedRank(rank);
  };

  const closeToolDetail = () => {
    setSelectedTool(null);
  };

  const addNewsBookmark = useCallback(async (article) => {
    if (!user) return;
    await addDoc(collection(db, "newsBookmarks"), {
      uid: user.uid,
      link: article.link,
      title: article.title,
      description: article.description,
      relativeTime: article.relativeTime
    });
  }, [user]);

  const removeNewsBookmark = useCallback(async (bookmarkId) => {
    if (!user) return;
    await deleteDoc(doc(db, "newsBookmarks", bookmarkId));
  }, [user]);

  const isNewsBookmarked = useCallback((articleLink) => {
    return newsBookmarks.some(b => b.link === articleLink);
  }, [newsBookmarks]);

  const getToolReaction = useCallback((toolId) => {
    const r = toolReactions.find(r => r.toolId === toolId);
    return r ? r.type : null;
  }, [toolReactions]);

  const toggleToolReaction = useCallback(async (toolId, type) => {
    if (!user) return;
    const docRef = doc(db, "toolReactions", `${user.uid}_${toolId}`);
    const existing = toolReactions.find(r => r.toolId === toolId);
    if (existing?.type === type) {
      await deleteDoc(docRef);
    } else {
      await setDoc(docRef, { uid: user.uid, toolId, type });
    }
  }, [user, toolReactions]);

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
    selectTheme,
    selectedArticle,
    setSelectedArticle,
    news,
    newsBookmarks,
    toggleNewsBookmark,
    isNewsBookmarked,
    bookmarkCounts,
    toolReactions,
    toggleToolReaction,
    getToolReaction,
  }), [tools, theme, selectedArticle, news, newsBookmarks, toggleNewsBookmark, isNewsBookmarked, bookmarkCounts, toolReactions, toggleToolReaction, getToolReaction]);

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
        </BrowserRouter>
      </ToolProvider>
    </AuthProvider>
  );
}
