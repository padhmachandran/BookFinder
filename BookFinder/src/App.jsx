// src/App.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";
import { useAuth } from "./auth/AuthContext";
import LoginRegister from "./auth/LoginRegister";
import useDebounce from "./hooks/useDebounce";
import "./App.css";

export default function App() {
  const { users, user, logout, addFavorite, removeFavoriteByKey, getFavorites, updateProfile } = useAuth();

  // UI state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // uiLang persisted to localStorage; fallback to user.lang or 'eng'
  const [uiLang, setUiLang] = useState(() => {
    try {
      const stored = localStorage.getItem("bookfinder_uiLang");
      if (stored) return stored;
    } catch {}
    return user?.lang || "eng";
  });

  // persist uiLang -> localStorage and user profile (if signed in)
  useEffect(() => {
    try { localStorage.setItem("bookfinder_uiLang", uiLang); } catch {}
    if (user) updateProfile({ lang: uiLang });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uiLang]);

  // Search form
  const [titleQuery, setTitleQuery] = useState("");
  const [authorQuery, setAuthorQuery] = useState("");
  const debouncedTitle = useDebounce(titleQuery, 450);

  // Results and paging
  const [results, setResults] = useState([]);
  const [numFound, setNumFound] = useState(0);
  const [page, setPage] = useState(1);
  const resultsPerPage = 20;

  // derive favorites from AuthContext so switching users shows correct favorites
  const favorites = useMemo(() => {
    try { return getFavorites() || []; } catch { return []; }
  }, [user?.username, JSON.stringify(users)]);

  // Only these five languages shown in dropdown
  const LANGS = [
    { code: "eng", name: "English" },
    { code: "hin", name: "हिन्दी (Hindi)" },
    { code: "tam", name: "தமிழ் (Tamil)" },
    { code: "tel", name: "తెలుగు (Telugu)" },
    { code: "mal", name: "മലയാളം (Malayalam)" },
  ];

  // Translations for the five languages (UI strings we use)
  const TRANSLATIONS = {
    eng: {
      searchPlaceholder: "Type a book title...",
      authorPlaceholder: "Author (optional)",
      search: "Search",
      reset: "Reset",
      favorites: "Favorites",
      noFavorites: "No favorites yet. Sign in and click ☆ to save.",
      results: "results",
      pageLabel: "Page",
      signedIn: "Signed in",
      signInRegister: "Sign in / Register",
      editProfile: "Edit Profile",
      logout: "Logout",
      remove: "Remove",
      firstPublished: "First published",
      view: "View",
      readPreview: "Preview / Read",
      rating: "Rating",
      reviews: "Reviews",
    },
    hin: {
      searchPlaceholder: "किताब का शीर्षक टाइप करें...",
      authorPlaceholder: "लेखक (वैकल्पिक)",
      search: "खोजें",
      reset: "रीसेट",
      favorites: "पसंदीदा",
      noFavorites: "अभी तक कोई पसंदीदा नहीं। साइन इन करें और ☆ पर क्लिक करें।",
      results: "परिणाम",
      pageLabel: "पृष्ठ",
      signedIn: "साइन इन किया गया",
      signInRegister: "साइन इन / पंजीकरण",
      editProfile: "प्रोफ़ाइल संपादित करें",
      logout: "लॉगआउट",
      remove: "हटाएँ",
      firstPublished: "प्रथम प्रकाशित",
      view: "देखें",
      readPreview: "पूर्वावलोकन / पढ़ें",
      rating: "रेटिंग",
      reviews: "समीक्षाएँ",
    },
    tam: {
      searchPlaceholder: "ஒரு புத்தகத்தின் தலைப்பை உள்ளிடவும்...",
      authorPlaceholder: "ஆசிரியர் (விருப்பம்)",
      search: "தேடு",
      reset: "மீட்டமை",
      favorites: "பிடித்தவை",
      noFavorites: "இன்னும் பிடித்தவை எதுவும் இல்லை. உள்நுழைந்து ☆ அழுத்தவும்.",
      results: "முடிவுகள்",
      pageLabel: "பக்கம்",
      signedIn: "உள்நுழைந்தார்",
      signInRegister: "உள்நுழை / பதிவு செய்",
      editProfile: "சுயவிவரம் திருத்து",
      logout: "வெளியேறு",
      remove: "அகற்று",
      firstPublished: "முதல் வெளியீடு",
      view: "பார்வை",
      readPreview: "முன்னோட்டம் / வாசிக்க",
      rating: "மதிப்பீடு",
      reviews: "விமர்சனங்கள்",
    },
    tel: {
      searchPlaceholder: "పుస్తక శీర్షికను టైపు చేయండి...",
      authorPlaceholder: "రచయిత (ఐచ్ఛికం)",
      search: "శోధించు",
      reset: "రీసెట్",
      favorites: "ఇష్టమైనవి",
      noFavorites: "ఇష్టమైనవి లేవు. దయచేసి సైన్ ఇన్ చేసి ☆ క్లిక్ చేయండి.",
      results: "ఫలితాలు",
      pageLabel: "పేజీ",
      signedIn: "సైన్ ఇన్ అయ్యారు",
      signInRegister: "సైన్ ఇన్ / నమోదు",
      editProfile: "ప్రొఫైల్ సవరించు",
      logout: "లాగ్ అవుట్",
      remove: "తొలగించు",
      firstPublished: "మొదటిగా ప్రచురించబడింది",
      view: "చూడండి",
      readPreview: "ప్రివ్యూ / చదవండి",
      rating: "రేటింగ్",
      reviews: "సమీక్షలు",
    },
    mal: {
      searchPlaceholder: "ഒരു പുസ്തകത്തിന്റെ പേര് ടൈപ്പ് ചെയ്യുക...",
      authorPlaceholder: "രചയിതാവ് (ഐച്ഛികം)",
      search: "തിരയുക",
      reset: "റീസെറ്റ്",
      favorites: "ഇഷ്ടപ്പെട്ടവ",
      noFavorites: "ഇവിടെ ഇനിമേൽ എന്തും ഇല്ല. സൈൻ ഇൻ ചെയ്ത് ☆ ക്ലിക്ക് ചെയ്യുക.",
      results: "ഫലങ്ങൾ",
      pageLabel: "താൾ",
      signedIn: "സൈൻ ഇൻ ചെയ്തിരിക്കുന്നു",
      signInRegister: "സൈൻ ഇൻ / രജിസ്റ്റർ ചെയ്യുക",
      editProfile: "പ്രൊഫൈൽ എഡിറ്റ് ചെയ്യുക",
      logout: "ലോഗ്ഔട്ട്",
      remove: "തൊഴിക്കുക",
      firstPublished: "ആദ്യമായി പ്രസിദ്ധീകരിച്ചത്",
      view: "കാണുക",
      readPreview: "പ്രിവ്യൂ / വായിക്കുക",
      rating: "റേറ്റിംഗ്",
      reviews: "പരിശോധനകൾ",
    },
  };

  // safe translation helper (fallback to English)
  function t(lang, key) {
    if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) return TRANSLATIONS[lang][key];
    if (TRANSLATIONS.eng && TRANSLATIONS.eng[key]) return TRANSLATIONS.eng[key];
    return "";
  }

  // perform search request to Open Library
  const performSearch = async (qTitle, qAuthor, pageNumber = 1) => {
    const title = (qTitle || "").trim();
    if (!title) {
      setResults([]);
      setNumFound(0);
      return;
    }

    const offset = (pageNumber - 1) * resultsPerPage;
    const params = new URLSearchParams();
    params.set("title", title);
    if (qAuthor && qAuthor.trim()) params.set("author", qAuthor.trim());
    params.set("limit", resultsPerPage);
    params.set("offset", offset);
    if (uiLang) params.set("language", uiLang);

    const url = `https://openlibrary.org/search.json?${params.toString()}`;
    try {
      const resp = await fetch(url);
      if (!resp.ok) {
        setResults([]);
        setNumFound(0);
        return;
      }
      const data = await resp.json();
      setNumFound(data.numFound || 0);
      const docs = data.docs || [];
      const mapped = docs.map((d) => ({
        key: d.key, // /works/OLxxxW
        title: d.title,
        author_name: d.author_name,
        cover_i: d.cover_i,
        first_publish_year: d.first_publish_year,
        cover_edition_key: d.cover_edition_key,
      }));
      setResults(mapped);
    } catch (err) {
      console.error("Search failed", err);
      setResults([]);
      setNumFound(0);
    }
  };

  // run search when debounced title or authorQuery or uiLang changes
  useEffect(() => {
    setPage(1);
    performSearch(debouncedTitle, authorQuery, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTitle, authorQuery, uiLang]);

  // pagination helpers
  const nextPage = () => {
    const maxPage = Math.max(1, Math.ceil(numFound / resultsPerPage));
    if (page < maxPage) {
      const next = page + 1;
      setPage(next);
      performSearch(titleQuery, authorQuery, next);
    }
  };
  const prevPage = () => {
    if (page > 1) {
      const p = page - 1;
      setPage(p);
      performSearch(titleQuery, authorQuery, p);
    }
  };

  // Toggle favourite (uses auth context)
  const handleToggleFavorite = (book) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    const key = book.key || book.cover_edition_key || book.title;
    const isFav = favorites.some((f) => f.key === key);
    if (isFav) removeFavoriteByKey(key);
    else addFavorite(book);
  };

  // cover URL
  const coverUrl = (cover_i, size = "M") => (cover_i ? `https://covers.openlibrary.org/b/id/${cover_i}-${size}.jpg` : null);

  // author helper
  const authorText = (a) => {
    if (!a) return "";
    if (Array.isArray(a)) return a.join(", ");
    return a;
  };

  // pastel colors
  const PASTEL_COLORS = ["#FFF7ED", "#FEF3C7", "#ECFDF5", "#EFF6FF", "#F5F3FF", "#FFF1F2", "#FFFBEB", "#F0F9FF", "#FDF2F8", "#F7F7F7"];
  const colorForKey = (k) => {
    if (!k) return PASTEL_COLORS[0];
    let h = 0;
    for (let i = 0; i < k.length; i++) h = (h << 5) - h + k.charCodeAt(i);
    return PASTEL_COLORS[Math.abs(h) % PASTEL_COLORS.length];
  };

  // profile dropdown outside click close
  const profileRef = useRef(null);
  useEffect(() => {
    function onDocClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileDropdown(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const handleLogout = () => {
    logout();
    setShowProfileDropdown(false);
  };

  const handleReset = () => {
    setTitleQuery("");
    setAuthorQuery("");
    setResults([]);
    setNumFound(0);
    setPage(1);
  };

  // --- Details modal state & fetch ---
  const [selectedBook, setSelectedBook] = useState(null); // book from results
  const [workDetails, setWorkDetails] = useState(null);
  const [workRatings, setWorkRatings] = useState(null);
  const [workReviews, setWorkReviews] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const closeDetails = () => {
    setSelectedBook(null);
    setWorkDetails(null);
    setWorkRatings(null);
    setWorkReviews(null);
    setDetailsLoading(false);
  };

  // fetch work details, ratings, reviews when a book is selected
  const openDetails = async (book) => {
    setSelectedBook(book);
    setWorkDetails(null);
    setWorkRatings(null);
    setWorkReviews(null);
    setDetailsLoading(true);

    // book.key is expected to be like "/works/OLxxxxW"
    if (!book || !book.key) {
      setDetailsLoading(false);
      return;
    }

    const base = "https://openlibrary.org";
    try {
      // work JSON
      const wResp = await fetch(`${base}${book.key}.json`);
      if (wResp.ok) {
        const wData = await wResp.json();
        setWorkDetails(wData);
      }

      // ratings (may or may not exist)
      try {
        const rResp = await fetch(`${base}${book.key}/ratings.json`);
        if (rResp.ok) {
          const rData = await rResp.json();
          setWorkRatings(rData);
        }
      } catch (e) {
        // ignore ratings error
      }

      // reviews (may or may not exist)
      try {
        const revResp = await fetch(`${base}${book.key}/reviews.json`);
        if (revResp.ok) {
          const revData = await revResp.json();
          setWorkReviews(revData);
        }
      } catch (e) {
        // ignore reviews error
      }
    } catch (err) {
      console.error("Failed to fetch work details", err);
    } finally {
      setDetailsLoading(false);
    }
  };

  // helper to render description safely (string or object)
  const extractDescription = (wd) => {
    if (!wd) return null;
    if (wd.description) {
      if (typeof wd.description === "string") return wd.description;
      if (wd.description.value) return wd.description.value;
    }
    if (wd.excerpts && Array.isArray(wd.excerpts) && wd.excerpts.length) {
      // show first excerpt
      const ex = wd.excerpts[0];
      if (typeof ex === "string") return ex;
      if (ex.comment) return ex.comment;
      if (ex.excerpt && ex.excerpt.value) return ex.excerpt.value;
    }
    return null;
  };

  // helper to get rating summary if available
  const ratingSummary = (r) => {
    if (!r) return null;
    if (r.summary) return r.summary; // some responses have summary object
    return null;
  };

  return (
    <div className="root">
      <header className="header" style={{ marginBottom: 18 }}>
        <div className="brand">
          <div className="logoBox">📚</div>
          <div>
            <h1 style={{ margin: 0 }}>BookFinder</h1>
            <div className="subtitle">Quick title search — choose language from the header</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <select className="uiLangSelect" value={uiLang} onChange={(e) => setUiLang(e.target.value)}>
            {LANGS.map((L) => <option key={L.code} value={L.code}>{L.name}</option>)}
          </select>

          <div className="profileWrapper" ref={profileRef}>
            {!user ? (
              <button className="btn primary" onClick={() => setShowAuthModal(true)}>{t(uiLang, "signInRegister")}</button>
            ) : (
              <>
                <button className="profileBtn" onClick={() => setShowProfileDropdown((v) => !v)}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(90deg,#06b6d4,#7c3aed)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                    {user.username.slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ marginLeft: 8 }}>
                    <div style={{ fontWeight: 700 }}>{user.name || user.username}</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>{t(uiLang, "signedIn")}</div>
                  </div>
                </button>

                <div className={`profileDropdown ${showProfileDropdown ? "visible" : ""}`} style={{ right: 0, top: 52 }}>
                  <div style={{ padding: 8 }}>
                    <div style={{ fontWeight: 700 }}>{user.name || user.username}</div>
                    <div style={{ color: "#6b7280", fontSize: 13 }}>{user.username}</div>
                  </div>
                  <hr style={{ margin: "6px 0", border: "none", borderTop: "1px solid #eef2f6" }} />
                  <button className="btn" onClick={() => { setShowAuthModal(true); setShowProfileDropdown(false); }}>{t(uiLang, "editProfile")}</button>
                  <button className="btn" onClick={() => handleLogout()}>{t(uiLang, "logout")}</button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container">
        <section className="searchPanel">
          <div className="searchTop">
            <input className="searchInput" placeholder={t(uiLang, "searchPlaceholder")} value={titleQuery} onChange={(e) => setTitleQuery(e.target.value)} />
            <input className="authorInput" placeholder={t(uiLang, "authorPlaceholder")} value={authorQuery} onChange={(e) => setAuthorQuery(e.target.value)} />
            <div className="buttons">
              <button className="btn primary" onClick={() => performSearch(titleQuery, authorQuery, 1)}>{t(uiLang, "search")}</button>
              <button className="btn" onClick={() => handleReset()}>{t(uiLang, "reset")}</button>
            </div>
          </div>

          <div className="metaRow" style={{ marginTop: 12 }}>
            <div>{numFound.toLocaleString()} {t(uiLang, "results")}</div>
            <div style={{ color: "#6b7280" }}>{t(uiLang, "pageLabel")} {page} / {Math.max(1, Math.ceil(numFound / resultsPerPage))}</div>
          </div>

          <div className="results" style={{ marginTop: 12 }}>
            <ul className="grid">
              {results.map((b) => {
                const key = b.key || b.cover_edition_key || b.title;
                const isFav = favorites.some((f) => f.key === key);
                const bg = colorForKey(key);
                return (
                  <li className="card" key={key} style={{ background: bg }}>
                    <div className="thumb">
                      {b.cover_i ? <img src={coverUrl(b.cover_i)} alt={b.title} /> : <div className="noCover">No cover</div>}
                    </div>

                    <div className="meta">
                      <a className="title" href={`https://openlibrary.org${b.key}`} target="_blank" rel="noreferrer">{b.title}</a>
                      <div className="author">{authorText(b.author_name)}</div>
                      <div className="small">{t(uiLang, "firstPublished")}: {b.first_publish_year || "—"}</div>

                      <div className="cardActions">
                        <button className={`favBtn ${isFav ? "active" : ""}`} onClick={() => handleToggleFavorite(b)}>{isFav ? "★ " + t(uiLang, "remove") : "☆ " + t(uiLang, "favorites")}</button>
                        <button className="btn" onClick={() => openDetails(b)}>{t(uiLang, "view")}</button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="pagination" style={{ marginTop: 12 }}>
              <button className="btn" onClick={prevPage} disabled={page <= 1}>Prev</button>
              <div style={{ color: "#6b7280" }}>{page}</div>
              <button className="btn" onClick={nextPage} disabled={page >= Math.ceil(numFound / resultsPerPage)}>Next</button>
            </div>
          </div>
        </section>

        <aside className="favorites">
          <h3 style={{ marginTop: 0 }}>{t(uiLang, "favorites")}</h3>
          {favorites.length === 0 ? (
            <div className="muted">{t(uiLang, "noFavorites")}</div>
          ) : (
            <ul className="favList">
              {favorites.map((f) => (
                <li className="favItem" key={f.key}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{f.title}</div>
                    <div className="muted" style={{ fontSize: 13 }}>{(f.author_name && f.author_name.join ? f.author_name.join(", ") : (f.author_name || ""))}</div>
                  </div>
                  <div>
                    <button className="btn" onClick={() => removeFavoriteByKey(f.key)}>{t(uiLang, "remove")}</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </main>

      <footer className="footer">Data from Open Library · Built with Vite + React</footer>

      {showAuthModal && <LoginRegister onClose={() => setShowAuthModal(false)} />}

      {/* Details Modal */}
      {selectedBook && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(8,8,8,0.5)", display: "flex",
            alignItems: "center", justifyContent: "center", zIndex: 2000, padding: 20
          }}
          onClick={(e) => {
            // close when clicking overlay (but not inside modal)
            if (e.target === e.currentTarget) closeDetails();
          }}
        >
          <div style={{
            width: "90%", maxWidth: 980, maxHeight: "90vh", overflow: "auto",
            background: "#fff", borderRadius: 10, padding: 20, position: "relative", boxShadow: "0 20px 60px rgba(0,0,0,0.35)"
          }}>
            <button onClick={closeDetails} style={{ position: "absolute", right: 18, top: 12, border: "none", background: "transparent", fontSize: 22, cursor: "pointer" }}>×</button>

            <div style={{ display: "flex", gap: 18 }}>
              <div style={{ width: 180, flexShrink: 0 }}>
                {selectedBook.cover_i ? (
                  <img src={coverUrl(selectedBook.cover_i, "L")} alt={selectedBook.title} style={{ width: "100%", borderRadius: 8 }} />
                ) : (
                  <div style={{ width: "100%", height: 260, borderRadius: 8, background: "#f2f3f5" }} />
                )}
              </div>

              <div style={{ flex: 1 }}>
                <h2 style={{ marginTop: 0 }}>{selectedBook.title}</h2>
                <div style={{ color: "#6b7280", marginBottom: 12 }}>{authorText(selectedBook.author_name)}</div>

                {/* description */}
                <div style={{ marginBottom: 12 }}>
                  <strong>Description</strong>
                  <div style={{ marginTop: 8, lineHeight: 1.5 }}>
                    {detailsLoading && <div>Loading details…</div>}
                    {!detailsLoading && workDetails && extractDescription(workDetails) && (
                      <div>{extractDescription(workDetails)}</div>
                    )}
                    {!detailsLoading && workDetails && !extractDescription(workDetails) && (
                      <div style={{ color: "#6b7280" }}>No description available.</div>
                    )}
                    {!detailsLoading && !workDetails && (
                      <div style={{ color: "#6b7280" }}>No extra details available.</div>
                    )}
                  </div>
                </div>

                {/* small meta row */}
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
                  <div style={{ background: "#fff", padding: 14, borderRadius: 8, boxShadow: "0 6px 18px rgba(0,0,0,0.06)" }}>
                    <div style={{ color: "#6b7280", fontSize: 13 }}>{t(uiLang, "firstPublished")}</div>
                    <div style={{ fontWeight: 700 }}>{selectedBook.first_publish_year || (workDetails && (workDetails.first_publish_date || "—")) || "—"}</div>
                  </div>

                  {/* rating if available */}
                  {workRatings && ratingSummary(workRatings) && (
                    <div style={{ background: "#fff", padding: 14, borderRadius: 8, boxShadow: "0 6px 18px rgba(0,0,0,0.06)" }}>
                      <div style={{ color: "#6b7280", fontSize: 13 }}>{t(uiLang, "rating")}</div>
                      <div style={{ fontWeight: 700 }}>
                        {(ratingSummary(workRatings).average ? Number(ratingSummary(workRatings).average).toFixed(2) : "—")}
                        {ratingSummary(workRatings).count ? ` (${ratingSummary(workRatings).count} ratings)` : ""}
                      </div>
                    </div>
                  )}
                </div>

                {/* subjects */}
                {workDetails && workDetails.subjects && workDetails.subjects.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <strong>Subjects</strong>
                    <div style={{ marginTop: 8, padding: 12, background: "#fafafa", borderRadius: 8 }}>
                      {workDetails.subjects.slice(0, 30).join(", ")}
                    </div>
                  </div>
                )}

                {/* preview / read & open on Open Library */}
                <div style={{ marginTop: 6, display: "flex", gap: 10 }}>
                  {/* prefer edition url if available */}
                  <a
                    className="btn primary"
                    href={selectedBook.cover_edition_key ? `https://openlibrary.org/books/${selectedBook.cover_edition_key}` : `https://openlibrary.org${selectedBook.key}`}
                    target="_blank" rel="noreferrer"
                    style={{ textDecoration: "none", padding: "10px 14px", borderRadius: 8 }}
                  >
                    {t(uiLang, "readPreview")}
                  </a>

                  <a
                    className="btn"
                    href={`https://openlibrary.org${selectedBook.key}`}
                    target="_blank" rel="noreferrer"
                    style={{ textDecoration: "none", padding: "10px 14px", borderRadius: 8 }}
                  >
                    Open on OpenLibrary
                  </a>
                </div>
              </div>
            </div>

            {/* Reviews section (if available) */}
            {workReviews && Array.isArray(workReviews.entries) && workReviews.entries.length > 0 && (
              <>
                <hr style={{ margin: "18px 0", border: "none", borderTop: "1px solid #eef2f6" }} />
                <h3>{t(uiLang, "reviews")}</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {workReviews.entries.slice(0, 6).map((rev, idx) => (
                    <div key={idx} style={{ padding: 12, background: "#fff", borderRadius: 8, boxShadow: "0 6px 18px rgba(0,0,0,0.04)" }}>
                      <div style={{ fontWeight: 700 }}>{rev.author && (rev.author.name || rev.author.username) || "Anonymous"}</div>
                      <div style={{ color: "#6b7280", marginTop: 6 }}>{rev.summary || (rev.excerpt && rev.excerpt.value) || (rev.body && (typeof rev.body === "string" ? rev.body : rev.body.value))}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
