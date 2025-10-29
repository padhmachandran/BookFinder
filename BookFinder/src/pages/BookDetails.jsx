// src/pages/BookDetails.jsx
import React, { useEffect, useState } from "react";

/**
 * Props:
 *  - workKey: string like "/works/OL82537W" (required)
 *  - onClose: function to close modal
 */
export default function BookDetails({ workKey, onClose }) {
  const [loading, setLoading] = useState(false);
  const [work, setWork] = useState(null);
  const [editions, setEditions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!workKey) return;
    let mounted = true;

    async function load() {
      setLoading(true);
      setError("");
      setWork(null);
      setEditions([]);

      try {
        // Work data: includes description, subjects, title, authors (if available)
        const workResp = await fetch(`https://openlibrary.org${workKey}.json`);
        if (!workResp.ok) throw new Error("Work fetch failed");
        const workData = await workResp.json();
        if (!mounted) return;
        setWork(workData);

        // Fetch a small list of editions (to show publishers / preview links)
        // limit small to reduce weight
        const edResp = await fetch(`https://openlibrary.org${workKey}/editions.json?limit=10`);
        if (edResp.ok) {
          const edData = await edResp.json();
          if (mounted) setEditions(edData?.entries || []);
        }
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load details");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, [workKey]);

  if (!workKey) return null;

  // helpers to render description (which might be string or object)
  const getDescription = (w) => {
    if (!w) return "";
    const d = w.description;
    if (!d) return "";
    if (typeof d === "string") return d;
    if (typeof d === "object" && d.value) return d.value;
    return "";
  };

  const previewLinkForEdition = (edition) => {
    if (!edition) return null;
    // edition.key like "/books/OL12345M"
    if (edition.key) return `https://openlibrary.org${edition.key}`;
    if (edition.cover_edition_key) return `https://openlibrary.org/books/${edition.cover_edition_key}`;
    return null;
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <button onClick={onClose} style={closeBtnStyle}>×</button>

        {loading && <div style={{ padding: 18 }}>Loading details…</div>}

        {error && <div style={{ padding: 18, color: "crimson" }}>Error: {error}</div>}

        {!loading && !error && work && (
          <div style={{ padding: 18, maxHeight: "75vh", overflow: "auto" }}>
            <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
              <div style={{ minWidth: 140 }}>
                {/* cover image if available (work covers usually exist via cover id) */}
                {work.covers && work.covers.length > 0 ? (
                  <img
                    src={`https://covers.openlibrary.org/b/id/${work.covers[0]}-L.jpg`}
                    alt={work.title}
                    style={{ width: 140, borderRadius: 8, objectFit: "cover" }}
                  />
                ) : (
                  <div style={{ width: 140, height: 200, borderRadius: 8, background: "#f1f1f1", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    No cover
                  </div>
                )}
              </div>

              <div style={{ flex: 1 }}>
                <h2 style={{ marginTop: 0 }}>{work.title}</h2>
                {work.authors && work.authors.length > 0 && (
                  <div style={{ marginBottom: 8, color: "#555" }}>
                    By {work.authors.map((a) => a.name || a.author?.key || "").filter(Boolean).join(", ")}
                  </div>
                )}

                {/* rating: Open Library doesn't provide a simple public rating endpoint for work in all cases.
                    If you want ratings, link out to the work page (where they display average rating).
                */}
                <div style={{ marginBottom: 12 }}>
                  <strong>Description</strong>
                  <div style={{ marginTop: 6, color: "#222", lineHeight: 1.5 }}>
                    {getDescription(work) || "No description available."}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
                  <div style={infoBoxStyle}>
                    <div style={{ fontSize: 12, color: "#666" }}>First published</div>
                    <div style={{ fontWeight: 700 }}>{work.first_publish_date || work.first_sentence || "—"}</div>
                  </div>

                  <div style={infoBoxStyle}>
                    <div style={{ fontSize: 12, color: "#666" }}>Subjects</div>
                    <div style={{ color: "#444", marginTop: 6 }}>
                      {work.subjects && work.subjects.length > 0 ? work.subjects.slice(0, 8).join(", ") : "—"}
                    </div>
                  </div>
                </div>

                {/* Editions / Preview */}
                <div style={{ marginTop: 8 }}>
                  <strong>Editions & preview</strong>
                  <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {editions.length === 0 && <div style={{ color: "#666" }}>No edition info available.</div>}
                    {editions.map((ed) => {
                      const pl = previewLinkForEdition(ed);
                      return (
                        <div key={ed.key || ed.cover_edition_key} style={{ minWidth: 180, padding: 8, background: "#fff", borderRadius: 8, boxShadow: "0 6px 18px rgba(0,0,0,0.04)" }}>
                          <div style={{ fontWeight: 700, fontSize: 14 }}>{ed.title || "Edition"}</div>
                          <div style={{ color: "#666", fontSize: 13 }}>{(ed.publishers && ed.publishers[0]) || (ed.publisher && ed.publisher[0]) || "—"}</div>
                          <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                            {pl && <a href={pl} target="_blank" rel="noreferrer" style={previewBtnStyle}>Open</a>}
                            {ed.preview && <span style={{ fontSize: 12, color: "#6b7280" }}>{ed.preview}</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div style={{ marginTop: 16 }}>
                  <a href={`https://openlibrary.org${workKey}`} target="_blank" rel="noreferrer" style={{ color: "#0a66c2" }}>View on Open Library (more details)</a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* styles (inline to avoid extra CSS file) */
const overlayStyle = {
  position: "fixed", inset: 0, background: "rgba(8,8,8,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3000,
};

const modalStyle = {
  width: "86%",
  maxWidth: 1000,
  background: "#fdfdfd",
  borderRadius: 14,
  boxShadow: "0 24px 80px rgba(10,20,40,0.25)",
  position: "relative",
};

const closeBtnStyle = {
  position: "absolute", right: 10, top: 6, border: "none", background: "transparent", fontSize: 28, cursor: "pointer", color: "#333",
};

const infoBoxStyle = {
  background: "#fff", padding: 12, borderRadius: 10, minWidth: 160, boxShadow: "0 8px 18px rgba(12,18,28,0.04)"
};

const previewBtnStyle = {
  display: "inline-block", padding: "6px 10px", borderRadius: 8, background: "#0ea5a5", color: "#fff", textDecoration: "none", fontWeight: 700
};
