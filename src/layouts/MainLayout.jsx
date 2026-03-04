import { useState, useEffect, useCallback } from "react";
import { Outlet } from "react-router-dom";

import GlobalStyles from "../styles/GlobalStyles";
import BackgroundEffects from "../components/layout/BackgroundEffects";
import Navbar from "../components/layout/Navbar";
import TickerBar from "../components/layout/TickerBar";
import Footer from "../components/layout/Footer";

export default function MainLayout() {
  const [theme, setTheme] = useState("light");

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

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
        />
        <TickerBar />
        <Outlet /> 
        <Footer />
      </div>
    </>
  );
}
