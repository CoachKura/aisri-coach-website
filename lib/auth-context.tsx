"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { login as apiLogin, register as apiRegister, logout as apiLogout, tokenStorage } from "@/lib/api";

interface User { id: string; email: string; name: string }

interface AuthCtx {
  user: User | null;
  token: string | null;
  isAuthed: boolean;
  openAuth: (mode?: "login" | "register") => void;
  closeAuth: () => void;
  logout: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);

export function useAuth(): AuthCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used inside <AuthProvider>");
  return c;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");

  // Restore token (and a saved user blob) on mount
  useEffect(() => {
    const t = tokenStorage.get();
    if (t) setToken(t);
    if (typeof window !== "undefined") {
      const u = window.localStorage.getItem("aisri_user");
      if (u) {
        try { setUser(JSON.parse(u)); } catch { /* ignore */ }
      }
    }
  }, []);

  const openAuth = useCallback((m: "login" | "register" = "login") => {
    setMode(m);
    setOpen(true);
  }, []);
  const closeAuth = useCallback(() => setOpen(false), []);

  const logout = useCallback(() => {
    apiLogout();
    if (typeof window !== "undefined") window.localStorage.removeItem("aisri_user");
    setUser(null);
    setToken(null);
  }, []);

  const handleLogin = useCallback(async (email: string, password: string) => {
    const r = await apiLogin({ email, password });
    setUser({ id: r.user.id, email: r.user.email, name: r.user.name });
    setToken(r.token.access_token);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("aisri_user", JSON.stringify({ id: r.user.id, email: r.user.email, name: r.user.name }));
    }
  }, []);

  const handleRegister = useCallback(async (email: string, name: string, password: string) => {
    const r = await apiRegister({ email, name, password });
    setUser({ id: r.user.id, email: r.user.email, name: r.user.name });
    setToken(r.token.access_token);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("aisri_user", JSON.stringify({ id: r.user.id, email: r.user.email, name: r.user.name }));
    }
  }, []);

  const value = useMemo<AuthCtx>(() => ({
    user, token, isAuthed: !!token, openAuth, closeAuth, logout,
  }), [user, token, openAuth, closeAuth, logout]);

  return (
    <Ctx.Provider value={value}>
      {children}
      {open && (
        <AuthModal
          mode={mode}
          setMode={setMode}
          onClose={closeAuth}
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      )}
    </Ctx.Provider>
  );
}

function AuthModal({
  mode, setMode, onClose, onLogin, onRegister,
}: {
  mode: "login" | "register";
  setMode: (m: "login" | "register") => void;
  onClose: () => void;
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (email: string, name: string, password: string) => Promise<void>;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "login") await onLogin(email.trim(), password);
      else await onRegister(email.trim(), name.trim() || email.trim().split("@")[0], password);
      onClose();
    } catch (err: unknown) {
      // axios error shape
      const e = err as { response?: { data?: { message?: string | string[] } }; message?: string };
      const msg = e?.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(", ") : (msg || e?.message || "Authentication failed"));
    } finally {
      setBusy(false);
    }
  }

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);
  if (!mounted || typeof document === 'undefined') return null;
  const node = (
    <div
      className="fixed inset-0 z-[9999] flex items-start sm:items-center justify-center bg-black/85 backdrop-blur-sm px-4 py-8 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="max-w-md w-full rounded-2xl border border-gray-700 p-6 sm:p-8 relative bg-gray-950 shadow-2xl my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition"
          aria-label="Close"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-1 gradient-text">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          {mode === "login" ? "Sign in to access your AISRI dashboard." : "Free demo account — no card required."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-gray-400">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-950 border border-gray-700 focus:border-green-500 focus:outline-none text-white placeholder-gray-500 [color-scheme:dark]"
              autoComplete="email"
            />
          </div>

          {mode === "register" && (
            <div>
              <label className="text-xs text-gray-400">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-950 border border-gray-700 focus:border-green-500 focus:outline-none text-white placeholder-gray-500 [color-scheme:dark]"
                autoComplete="name"
              />
            </div>
          )}

          <div>
            <label className="text-xs text-gray-400">Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-950 border border-gray-700 focus:border-green-500 focus:outline-none text-white placeholder-gray-500 [color-scheme:dark]"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
          </div>

          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full py-2.5 rounded-lg bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed font-semibold transition"
          >
            {busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-400">
          {mode === "login" ? (
            <>
              No account?{" "}
              <button onClick={() => { setError(null); setMode("register"); }} className="text-green-400 hover:underline">
                Create one
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button onClick={() => { setError(null); setMode("login"); }} className="text-green-400 hover:underline">
                Sign in
              </button>
            </>
          )}
        </div>

        <div className="mt-4 text-xs text-gray-500 text-center">
          Try the demo: <code className="text-gray-400">demo@aisricoach.com</code> / <code className="text-gray-400">Demo1234!</code>
        </div>
      </div>
    </div>
  );
  return createPortal(node, document.body);
}