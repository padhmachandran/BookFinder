import React, { useEffect, useState } from "react";
import { TRANSLATIONS, LANGUAGES } from "../translations";

/**
 * Header Component
 * - Responsive for both mobile and desktop
 * - Clean UI and UX with accessibility
 * - Handles user login/logout and language selection
 */
export default function Header({
  user,
  uiLang = "eng",
  onLangChange,
  onSignIn,
  onLogout,
}) {
  const [currentLang, setCurrentLang] = useState(uiLang || "eng");

  // Sync language from parent
  useEffect(() => {
    if (uiLang && uiLang !== currentLang) setCurrentLang(uiLang);
  }, [uiLang]);

  // Load persisted language from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("bookfinder_uiLang");
      if (saved && saved !== currentLang) {
        setCurrentLang(saved);
        if (onLangChange) onLangChange(saved);
      }
    } catch {}
  }, []);

  const handleLangChange = (e) => {
    const selected = e.target.value;
    setCurrentLang(selected);
    try {
      localStorage.setItem("bookfinder_uiLang", selected);
    } catch {}
    if (onLangChange) onLangChange(selected);
  };

  // fallback translation
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.eng;

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap", // ✅ allows wrapping on small screens
        padding: "12px 16px",
        borderRadius: 14,
        margin: "16px auto",
        maxWidth: 1200,
        background: "linear-gradient(90deg, #7F00FF 0%, #E100FF 100%)",
        color: "#fff",
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        gap: 12,
      }}
    >
      {/* Logo and Title */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          flex: "1 1 auto",
          minWidth: 240,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            background: "linear-gradient(135deg,#06b6d4,#7c3aed)",
            boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
          }}
          aria-label="BookFinder logo"
        >
          📚
        </div>

        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(18px, 2vw, 22px)", // ✅ responsive font size
              fontWeight: 700,
            }}
          >
            BookFinder
          </h1>
          <div
            style={{
              fontSize: "clamp(12px, 1.6vw, 14px)", // ✅ scales for mobile
              opacity: 0.9,
            }}
          >
            Quick title search — choose your language
          </div>
        </div>
      </div>

      {/* Language & Auth Section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap", // ✅ ensures wrapping on smaller screens
          justifyContent: "flex-end",
          flex: "1 1 auto",
        }}
      >
        {/* Language Selector */}
        <select
          aria-label="Choose language"
          value={currentLang}
          onChange={handleLangChange}
          style={{
            padding: "8px 10px",
            borderRadius: 8,
            border: "none",
            fontWeight: 600,
            minWidth: 150,
            boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            fontSize: "clamp(13px, 1.6vw, 15px)", // ✅ adjusts size
          }}
        >
          {Object.entries(LANGUAGES)
            .filter(([code]) =>
              ["eng", "hin", "tam", "tel", "mal"].includes(code)
            )
            .map(([code, label]) => (
              <option key={code} value={code}>
                {label}
              </option>
            ))}
        </select>

        {/* Auth Button */}
        {user ? (
          <button
            onClick={onLogout}
            style={{
              padding: "8px 14px",
              borderRadius: 10,
              background: "#fff",
              color: "#7c3aed",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              fontSize: "clamp(13px, 1.6vw, 15px)",
            }}
          >
            {t.logout || "Logout"}
          </button>
        ) : (
          <button
            onClick={onSignIn}
            style={{
              padding: "8px 14px",
              borderRadius: 10,
              background: "#fff",
              color: "#7c3aed",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              fontSize: "clamp(13px, 1.6vw, 15px)",
            }}
          >
            {t.login || "Sign in / Register"}
          </button>
        )}
      </div>
    </header>
  );
}
