"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useWorkouts } from "@/hooks/useApi";
import { fetchWorkoutStats, type WorkoutStats } from "@/lib/api";
import SkeletonCard from "@/components/SkeletonCard";

const TYPE_ICON: Record<string, string> = {
  easy: "RUN",
  tempo: "FIRE",
  recovery: "ZEN",
  long: "LONG",
  interval: "FAST",
  strength: "STR",
};

const DIFFICULTY_COLOR: Record<string, string> = {
  easy: "bg-accent-green/15 text-accent-green",
  moderate: "bg-accent-yellow/15 text-accent-yellow",
  hard: "bg-accent-red/15 text-accent-red",
};

function iconFor(type: string): string {
  const k = (type || "").toLowerCase();
  return TYPE_ICON[k] ?? "RUN";
}

export default function WorkoutsPage() {
  const { user, openAuth } = useAuth();
  const { data: workouts, loading, error, retry } = useWorkouts();
  const [stats, setStats] = useState<WorkoutStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (!user) { setStats(null); setStatsLoading(false); return; }
    setStatsLoading(true);
    fetchWorkoutStats(7)
      .then((s) => { if (!cancelled) setStats(s); })
      .catch(() => { if (!cancelled) setStats({ totalKm: 0, sessions: 0, calories: 0 }); })
      .finally(() => { if (!cancelled) setStatsLoading(false); });
    return () => { cancelled = true; };
  }, [user]);

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full text-center rounded-2xl p-8 border border-gray-800 bg-gray-900/80 backdrop-blur">
          <div className="text-5xl mb-4">RUN</div>
          <h1 className="text-2xl font-bold mb-2">Sign in to view workouts</h1>
          <p className="text-gray-400 mb-6">Track every session, see weekly trends, and get adaptive plans.</p>
          <button onClick={() => openAuth("login")} className="px-6 py-3 rounded-xl bg-accent-green text-black font-semibold hover:scale-[1.02] transition">Sign In</button>
        </motion.div>
      </main>
    );
  }

  const today = workouts?.[0];

  return (
    <main className="min-h-screen px-4 sm:px-6 lg:px-12 py-10 max-w-6xl mx-auto">
      <motion.header initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Your Workouts</h1>
        <p className="text-gray-400 mt-1">Last 7 days at a glance.</p>
      </motion.header>

      <section className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
        {statsLoading ? (
          <>
            <SkeletonCard className="h-24" />
            <SkeletonCard className="h-24" />
            <SkeletonCard className="h-24" />
          </>
        ) : (
          [
            { label: "Distance", value: (stats?.totalKm ?? 0) + " km", accent: "text-accent-green" },
            { label: "Sessions", value: String(stats?.sessions ?? 0), accent: "text-accent-blue" },
            { label: "Calories", value: String(stats?.calories ?? 0), accent: "text-accent-yellow" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="rounded-2xl p-4 sm:p-5 border border-gray-800 bg-gray-900/60 backdrop-blur">
              <div className="text-xs uppercase tracking-wider text-gray-500">{s.label}</div>
              <div className={"text-2xl sm:text-3xl font-bold mt-1 " + s.accent}>{s.value}</div>
            </motion.div>
          ))
        )}
      </section>

      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="relative rounded-2xl p-[1px] bg-gradient-to-br from-accent-green via-accent-blue to-accent-yellow mb-8">
        <div className="rounded-2xl bg-gray-950 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-gray-400">Today</div>
              <h2 className="text-2xl font-bold mt-1">{today?.title ?? "Easy 5K shakeout"}</h2>
            </div>
            <div className="text-3xl font-bold tracking-wider text-accent-green">{iconFor(today?.type ?? "easy")}</div>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-gray-300 mb-5">
            <span className="px-3 py-1 rounded-full bg-white/5 border border-gray-800">{today?.duration ?? 30} min</span>
            <span className={"px-3 py-1 rounded-full " + (DIFFICULTY_COLOR[today?.difficulty ?? "easy"] ?? "bg-white/5 text-gray-300")}>{today?.difficulty ?? "easy"}</span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-gray-800 capitalize">{today?.type ?? "easy"}</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">Keep it conversational. Aim for nasal breathing for the first 10 minutes &mdash; if you can hold a sentence, you are in the right zone.</p>
          <div className="mt-6 flex gap-3">
            <Link href="/checkin" className="px-5 py-2.5 rounded-xl bg-accent-green text-black font-semibold hover:scale-[1.02] transition">Start check-in</Link>
            <button className="px-5 py-2.5 rounded-xl border border-gray-700 text-gray-200 hover:bg-white/5 transition">View plan</button>
          </div>
        </div>
      </motion.section>

      <section>
        <h3 className="text-lg font-semibold mb-4">Recent</h3>
        {loading ? (
          <div className="space-y-3">
            <SkeletonCard className="h-16" />
            <SkeletonCard className="h-16" />
            <SkeletonCard className="h-16" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-gray-800 p-6 text-center">
            <p className="text-gray-400 mb-4">{error}</p>
            <button onClick={retry} className="px-4 py-2 rounded-xl bg-accent-blue/20 text-accent-blue border border-accent-blue/40 hover:bg-accent-blue/30 transition">Retry</button>
          </div>
        ) : !workouts || workouts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-800 p-10 text-center">
            <div className="text-4xl mb-3">EMPTY</div>
            <p className="text-gray-300 font-medium">No workouts yet</p>
            <p className="text-gray-500 text-sm mt-1">Log your first session to start your streak.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {workouts.map((w, i) => (
              <motion.li key={w.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} whileHover={{ scale: 1.01 }} className="flex items-center gap-4 rounded-2xl border border-gray-800 bg-gray-900/60 p-4">
                <div className="text-xl font-bold text-accent-green tracking-wider w-12">{iconFor(w.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{w.title}</div>
                  <div className="text-xs text-gray-500 capitalize">{w.type} &middot; {w.duration} min</div>
                </div>
                <span className={"px-3 py-1 rounded-full text-xs " + (DIFFICULTY_COLOR[w.difficulty] ?? "bg-white/5 text-gray-300")}>{w.difficulty}</span>
              </motion.li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}