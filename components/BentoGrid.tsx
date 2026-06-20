"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/* ------------------------------------------------------------------ */
/* Animation variants                                                  */
/* ------------------------------------------------------------------ */

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

/* ------------------------------------------------------------------ */
/* Tile shell                                                          */
/* ------------------------------------------------------------------ */

interface TileProps {
  className?: string;
  children: ReactNode;
  /** subtle accent glow on hover, e.g. "hover:border-accent-green/40" */
  accent?: string;
}

function Tile({ className = "", children, accent = "hover:border-accent-green/40" }: TileProps) {
  return (
    <motion.div
      variants={item}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={`group relative overflow-hidden glass-strong rounded-xl2 border border-white/10 ${accent} transition-colors p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Decorative mini-visuals                                             */
/* ------------------------------------------------------------------ */

function MiniRing({ score = 87 }: { score?: number }) {
  const r = 46;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  return (
    <svg viewBox="0 0 120 120" className="w-28 h-28 -rotate-90">
      <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
      <motion.circle
        cx="60"
        cy="60"
        r={r}
        fill="none"
        stroke="#00E676"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        whileInView={{ strokeDashoffset: offset }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
    </svg>
  );
}

function MiniBars() {
  const heights = [40, 65, 50, 80, 60, 92, 70];
  return (
    <div className="flex items-end gap-1.5 h-16">
      {heights.map((h, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          whileInView={{ height: `${h}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: i * 0.05, ease: "easeOut" }}
          className="w-2.5 rounded-full bg-gradient-to-t from-accent-blue/40 to-accent-green"
        />
      ))}
    </div>
  );
}

function StreakDots() {
  const labels = ["M", "T", "W", "T", "F", "S", "S"];
  const active = [true, true, true, false, true, true, true];
  return (
    <div className="flex items-center justify-between gap-2">
      {labels.map((l, i) => (
        <div key={i} className="flex flex-col items-center gap-1.5">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className={`w-3 h-3 rounded-full ${active[i] ? "bg-accent-green shadow-glow-green" : "bg-white/10"}`}
          />
          <span className="text-[10px] text-gray-500">{l}</span>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Bento grid                                                          */
/* ------------------------------------------------------------------ */

export default function BentoGrid() {
  return (
    <section id="features" className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mb-10 sm:mb-14"
      >
        <span className="text-accent-green text-xs font-semibold uppercase tracking-[0.2em]">
          Everything in one place
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mt-3 leading-tight">
          A coach that <span className="gradient-text">reads your body</span> — daily.
        </h2>
        <p className="text-gray-400 mt-4 leading-relaxed">
          Readiness, recovery, biomechanics, and adaptive training — synthesized into one clear
          decision every morning.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(160px,auto)] gap-4 sm:gap-5"
      >
        {/* Hero tile — AISRI score */}
        <Tile className="sm:col-span-2 lg:col-span-2 lg:row-span-2 flex flex-col justify-between">
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-accent-green/15 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-2xl font-bold text-white mb-2">AISRI Readiness Score</h3>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              A single 0–100 rating from sleep, fatigue, mood, and training load — calibrated to
              your own history, refreshed every morning.
            </p>
          </div>
          <div className="relative z-10 flex items-center justify-between mt-6">
            <div>
              <div className="text-5xl font-bold text-white tabular-nums leading-none">87</div>
              <div className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold bg-accent-green/15 text-accent-green">
                🟢 Ready to push
              </div>
            </div>
            <MiniRing score={87} />
          </div>
        </Tile>

        {/* AI Coach */}
        <Tile accent="hover:border-secondary/50" className="lg:col-span-2 flex flex-col justify-between">
          <div className="relative z-10">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="text-xl font-semibold text-white mb-2">Always-on AI Coach</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Plain-English guidance: what to do today, what to skip, and exactly how hard to push.
            </p>
          </div>
          <div className="relative z-10 mt-5 flex gap-2">
            <div className="glass-sm rounded-2xl rounded-bl-sm px-3 py-2 text-xs text-gray-300 max-w-[80%]">
              Should I run intervals today?
            </div>
          </div>
          <div className="relative z-10 mt-2 flex justify-end">
            <div className="rounded-2xl rounded-br-sm px-3 py-2 text-xs text-black font-medium bg-accent-green max-w-[80%]">
              Yes — your score supports a quality session. Pre-fuel 60 min before. 🟢
            </div>
          </div>
        </Tile>

        {/* Biomechanics */}
        <Tile accent="hover:border-accent-blue/50" className="flex flex-col justify-between">
          <div>
            <div className="text-3xl mb-2">🦿</div>
            <h3 className="text-lg font-semibold text-white">Biomechanics</h3>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              Cadence, ground contact &amp; stride, scored and trended.
            </p>
          </div>
          <div className="mt-4">
            <MiniBars />
          </div>
        </Tile>

        {/* Adaptive plans */}
        <Tile accent="hover:border-accent-yellow/50" className="flex flex-col justify-between">
          <div>
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="text-lg font-semibold text-white">Adaptive Plans</h3>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              Workouts that re-shape around recovery and weekly load.
            </p>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <span className="w-7 h-7 rounded-lg bg-accent-green/15 text-accent-green flex items-center justify-center">🏃</span>
              Tempo · 40 min
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <span className="w-7 h-7 rounded-lg bg-accent-blue/15 text-accent-blue flex items-center justify-center">💪</span>
              Strength · 25 min
            </div>
          </div>
        </Tile>

        {/* Recovery streak — wide */}
        <Tile accent="hover:border-accent-green/40" className="sm:col-span-2 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-3xl mb-2">🔥</div>
              <h3 className="text-lg font-semibold text-white">Recovery &amp; Streaks</h3>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed max-w-xs">
                Build the daily habit. Small wins compound into durable fitness.
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold gradient-text leading-none">6</div>
              <div className="text-[10px] uppercase tracking-wider text-gray-500 mt-1">day streak</div>
            </div>
          </div>
          <div className="mt-5">
            <StreakDots />
          </div>
        </Tile>
      </motion.div>
    </section>
  );
}
