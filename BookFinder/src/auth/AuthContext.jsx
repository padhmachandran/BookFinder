// src/auth/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const STORAGE_USERS = "bookfinder_users";
const STORAGE_CURRENT = "bookfinder_currentUser";

const AuthContext = createContext(null);

function loadUsers() {
  try { return JSON.parse(localStorage.getItem(STORAGE_USERS) || "{}"); } catch { return {}; }
}
function saveUsers(users) {
  try { localStorage.setItem(STORAGE_USERS, JSON.stringify(users)); } catch {}
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => loadUsers());
  const [user, setUser] = useState(() => {
    try {
      const uname = localStorage.getItem(STORAGE_CURRENT);
      if (!uname) return null;
      const u = loadUsers()[uname];
      if (!u) return null;
      return { username: uname, name: u.profile?.name || uname, lang: u.profile?.lang || "eng" };
    } catch { return null; }
  });

  useEffect(() => { saveUsers(users); }, [users]);

  function register(username, password, name = "") {
    if (!username || !password) return { ok: false, message: "Username & password required" };
    if (users[username]) return { ok: false, message: "Username exists" };

    const newUsers = {
      ...users,
      [username]: { password, profile: { name: name || username, lang: "eng", favorites: [] } },
    };
    setUsers(newUsers);
    return { ok: true };
  }

  function login(username, password) {
    const u = users[username];
    if (!u) return { ok: false, message: "User not found" };
    if (u.password !== password) return { ok: false, message: "Invalid credentials" };
    localStorage.setItem(STORAGE_CURRENT, username);
    setUser({ username, name: u.profile?.name || username, lang: u.profile?.lang || "eng" });
    return { ok: true };
  }

  function logout() {
    localStorage.removeItem(STORAGE_CURRENT);
    setUser(null);
  }

  function updateProfile(profileUpdate = {}) {
    if (!user) return { ok: false, message: "Not signed in" };
    const u = users[user.username] || { password: "", profile: {} };
    const newProfile = { ...(u.profile || {}), ...profileUpdate };
    const newUsers = { ...users, [user.username]: { ...u, profile: newProfile } };
    setUsers(newUsers);
    setUser({ username: user.username, name: newProfile.name || user.username, lang: newProfile.lang || "eng" });
    return { ok: true };
  }

  function addFavorite(book) {
    if (!user) return { ok: false, message: "Sign in to save favorites" };
    const uname = user.username;
    const u = users[uname] || { password: "", profile: { favorites: [] } };
    const favs = Array.isArray(u.profile?.favorites) ? [...u.profile.favorites] : [];
    const key = book.key || book.cover_edition_key || book.title;
    if (!favs.some((f) => f.key === key)) {
      favs.unshift({ key, title: book.title, author_name: book.author_name, cover_i: book.cover_i });
    }
    const newUsers = { ...users, [uname]: { ...u, profile: { ...(u.profile || {}), favorites: favs } } };
    setUsers(newUsers);
    return { ok: true };
  }

  function removeFavoriteByKey(bookKey) {
    if (!user) return { ok: false, message: "Sign in to remove favorites" };
    const uname = user.username;
    const u = users[uname] || { password: "", profile: { favorites: [] } };
    const favs = Array.isArray(u.profile?.favorites) ? u.profile.favorites.filter((f) => f.key !== bookKey) : [];
    const newUsers = { ...users, [uname]: { ...u, profile: { ...(u.profile || {}), favorites: favs } } };
    setUsers(newUsers);
    return { ok: true };
  }

  function getFavorites() {
    if (!user) return [];
    const u = users[user.username];
    return (u && u.profile && Array.isArray(u.profile.favorites)) ? u.profile.favorites : [];
  }

  return (
    <AuthContext.Provider value={{
      users, user, register, login, logout, updateProfile,
      addFavorite, removeFavoriteByKey, getFavorites
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
