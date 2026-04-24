"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthed, openAuth, logout } = useAuth();
  const pathname = usePathname() || "/";

  const marketingItems = [
    { label: "Features", href: "/#features" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Contact", href: "/contact" },
  ];

  const authedItems = [
    { label: "Dashboard", href: "/" },
    { label: "Check-in", href: "/checkin" },
    { label: "Workouts", href: "/workouts" },
  ];

  const items = isAuthed ? authedItems : marketingItems;

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 w-full z-50 glass border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-accent-green to-accent-blue rounded-lg flex items-center justify-center shadow-glow-green">
              <span className="text-black font-bold text-sm">AI</span>
            </div>
            <span className="gradient-text font-bold text-lg hidden sm:inline">
              AISRI Coach
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "text-accent-green"
                    : "text-gray-300 hover:text-accent-green"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isAuthed ? (
              <button
                onClick={() => logout()}
                className="px-4 py-2 rounded-lg border border-white/15 text-sm text-gray-200 hover:border-accent-red/60 hover:text-accent-red transition"
              >
                Sign out
              </button>
            ) : (
              <>
                <button
                  onClick={() => openAuth("login")}
                  className="px-3 py-2 text-sm text-gray-300 hover:text-white transition"
                >
                  Sign in
                </button>
                <button
                  onClick={() => openAuth("register")}
                  className="px-5 py-2 rounded-lg bg-accent-green text-black hover:brightness-110 transition font-semibold text-sm shadow-glow-green"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="md:hidden pb-4 border-t border-white/10"
          >
            <div className="space-y-1 pt-3">
              {items.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`block px-4 py-2 rounded-lg transition ${
                    isActive(item.href)
                      ? "bg-accent-green/15 text-accent-green"
                      : "text-gray-300 hover:bg-white/10"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {isAuthed ? (
                <button
                  onClick={() => { setIsOpen(false); logout(); }}
                  className="w-full mt-3 px-4 py-2 rounded-lg border border-white/15 text-gray-200 hover:border-accent-red/60 hover:text-accent-red transition"
                >
                  Sign out
                </button>
              ) : (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => { setIsOpen(false); openAuth("login"); }}
                    className="flex-1 px-4 py-2 rounded-lg border border-white/15 text-gray-200 hover:border-white/30 transition"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => { setIsOpen(false); openAuth("register"); }}
                    className="flex-1 px-4 py-2 rounded-lg bg-accent-green text-black font-semibold transition shadow-glow-green"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}