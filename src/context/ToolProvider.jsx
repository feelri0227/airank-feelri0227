import { useState, useEffect, useMemo, useCallback } from "react";
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import ToolContext from "./ToolContext";
import { useAuth } from "./AuthContext";
import { TOOLS_DATA } from "../data/tools";

export function ToolProvider({ children }) {
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
  const [reactionCounts, setReactionCounts] = useState({});

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

    getDocs(collection(db, "toolReactions"))
      .then((snap) => {
        const counts = {};
        snap.docs.forEach((d) => {
          const { toolId, type } = d.data();
          if (!toolId) return;
          if (!counts[toolId]) counts[toolId] = { likes: 0, dislikes: 0 };
          if (type === "like") counts[toolId].likes++;
          else if (type === "dislike") counts[toolId].dislikes++;
        });
        setReactionCounts(counts);
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
      setReactionCounts(prev => {
        const c = prev[toolId] || { likes: 0, dislikes: 0 };
        return { ...prev, [toolId]: { likes: c.likes - (type === "like" ? 1 : 0), dislikes: c.dislikes - (type === "dislike" ? 1 : 0) } };
      });
    } else {
      await setDoc(docRef, { uid: user.uid, toolId, type });
      setReactionCounts(prev => {
        const c = prev[toolId] || { likes: 0, dislikes: 0 };
        return { ...prev, [toolId]: {
          likes: c.likes + (type === "like" ? 1 : 0) - (existing?.type === "like" ? 1 : 0),
          dislikes: c.dislikes + (type === "dislike" ? 1 : 0) - (existing?.type === "dislike" ? 1 : 0),
        }};
      });
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
    closeToolDetail, // 추가됨: Context value에 포함
    selectedTool,    // 추가됨: Context value에 포함
    selectedRank,    // 추가됨: Context value에 포함
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
    reactionCounts,
  }), [tools, selectedTool, selectedRank, theme, selectedArticle, news, newsBookmarks, toggleNewsBookmark, isNewsBookmarked, bookmarkCounts, toolReactions, toggleToolReaction, getToolReaction, reactionCounts]);

  return (
    <ToolContext.Provider value={value}>
      {children}
    </ToolContext.Provider>
  );
}
