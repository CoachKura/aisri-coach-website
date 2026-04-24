"use client";

import Link from "next/link";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useAISRI, useWorkouts } from "@/hooks/useApi";
import InsightCard, { type InsightSeverity } from "@/components/InsightCard";
import SkeletonCard from "@/components/SkeletonCard";
import type { AISRIData, Workout } from "@/lib/types";

type RingTone = "green" | "yellow" | "red";

const STATUS_TO_TONE: Record<AISRIData["status"], RingTone> = {
  ready: "green",
  moderate: "yellow",
  recovery: "red",
};

const TONE_META: Record<RingTone, { label: string; emoji: string; line: string; stroke: string; chip: string; glow: string }> = {
  green: {
    label: "Ready",
    emoji: "🟢",
    line: "Your body is primed. Push the pace today.",
    stroke: "#00E676",
    chip: "bg-accent-green/15 text-accent-green",
    glow: "shadow-glow-green",
  },
  yellow: {
    label: "Caution",
    emoji: "🟡",
    line: "Moderate effort recommended — listen to your body.",
    stroke: "#FFD600",
    chip: "bg-accent-yellow/15 text-accent-yellow",
    glow: "shadow-glow-yellow",
  },
  red: {
    label: "Recovery",
    emoji: "🔴",
    line: "Recovery first. Easy walk, mobility, and sleep tonight.",
    stroke: "#FF5252",
    chip: "bg-accent-red/15 text-accent-red",
    glow: "shadow-glow-red",
  },
};

const SEVERITY_BY_TONE: Record<RingTone, InsightSeverity> = {
  green: "low",
  yellow: "moderate",
  red: "high",
};

function AISRIRing({ score, tone }: { score: number; tone: RingTone }) {
  const meta = TONE_META[tone];
  const radius = 92;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference - (Math.max(0, Math.min(100, score)) / 100) * circumference;

  const display = useMotionValue(0);
  const rounded = useTransform(display, (v) => Math.round(v));
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const controls = animate(display, score, { duration: 1.2, ease: "easeOut" });
    const unsub = rounded.on("change", (v) => setShown(v as number));
    return () => {
      controls.stop();
      unsub();
    };
  }, [score, display, rounded]);

  return (
    <div className="relative w-60 h-60 sm:w-72 sm:h-72 flex items-center justify-center">
      <div className="absolute inset-2 rounded-full blur-2xl opacity-30" style={{ background: meta.stroke }} />
      <svg viewBox="0 0 220 220" className="w-full h-full -rotate-90">
        <circle cx="110" cy="110" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
        <motion.circle
          cx="110"
          cy="110"
          r={radius}
          fill="none"
          stroke={meta.stroke}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: targetOffset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-[10px] uppercase tracking-[0.25em] text-gray-400">AISRI</div>
        <div className="text-6xl sm:text-7xl font-bold text-white tabular-nums leading-none mt-1">
          {shown}
        </div>
        <div className={`mt-3 px-3 py-1 rounded-full text-xs font-semibold ${meta.chip}`}>
          {meta.emoji} {meta.label}
        </div>
      </div>
    </div>
  );
}

function StreakPills({ workouts }: { workouts: Workout[] | null }) {
  const days = useMemo(() => {
    const count = Math.min(7, workouts?.length ?? 0);
    return Array.from({ length: 7 }, (_, i) => i < count);
  }, [workouts]);
  const labels = ["M", "T", "W", "T", "F", "S", "S"];
  return (
    <div className="glass rounded-xl2 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-200">Daily streak</h3>
        <span className="text-xs text-gray-400">Last 7 days</span>
      </div>
      <div className="flex items-center justify-between gap-2">
        {days.map((active, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="flex flex-col items-center gap-1"
          >
            <div className={`w-3 h-3 rounded-full ${active ? "bg-accent-green shadow-glow-green" : "bg-white/10"}`} />
            <span className="text-[10px] text-gray-500">{labels[i]}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Sparkline({ values, color = "#00E676" }: { values: number[]; color?: string }) {
  const w = 280;
  const h = 70;
  const max = Math.max(1, ...values);
  const min = Math.min(0, ...values);
  const range = Math.max(1, max - min);
  const step = values.length > 1 ? w / (values.length - 1) : w;
  const points = values.map((v, i) => {
    const x = i * step;
    const y = h - ((v - min) / range) * (h - 8) - 4;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const path = `M ${points.join(" L ")}`;
  const area = `${path} L ${w},${h} L 0,${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-20">
      <defs>
        <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.45" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#sparkFill)" />
      <motion.path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      />
    </svg>
  );
}

function RunnerSilhouette() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden="true">
      <defs>
        <linearGradient id="runner" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#00E676" />
          <stop offset="100%" stopColor="#2979FF" />
        </linearGradient>
      </defs>
      <g className="animate-run-bob origin-center" fill="url(#runner)">
        <circle cx="118" cy="40" r="12" />
        <path d="M118 56 L102 100 L132 96 Z" />
        <path d="M122 70 L150 60 L156 70 L130 84 Z" />
        <path d="M114 70 L86 90 L80 80 L108 64 Z" />
        <path d="M120 100 L150 130 L142 142 L112 116 Z" />
        <path d="M108 100 L78 134 L86 146 L116 118 Z" />
      </g>
      <g stroke="#00E676" strokeOpacity="0.4" strokeLinecap="round" strokeWidth="2">
        <line x1="20" y1="80" x2="60" y2="80" />
        <line x1="10" y1="100" x2="55" y2="100" />
        <line x1="22" y1="120" x2="58" y2="120" />
      </g>
    </svg>
  );
}

function LoggedOutHero() {
  const { openAuth } = useAuth();
  const features = [
    { icon: "📊", title: "AISRI Score", desc: "Real-time readiness rating from sleep, fatigue, mood, and load — calibrated to your training history." },
    { icon: "🤖", title: "AI Coach", desc: "Plain-English daily guidance: what to do today, what to skip, and how hard to push." },
    { icon: "🎯", title: "Adaptive Plans", desc: "Workouts that re-shape themselves based on recovery, biomechanics, and weekly load." },
  ];

  return (
    <main className="overflow-hidden">
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center px-4 sm:px-6 lg:px-8">
        <div className="absolute -top-24 -left-32 w-[420px] h-[420px] bg-accent-green/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute -bottom-24 -right-24 w-[420px] h-[420px] bg-accent-blue/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: "4s" }} />

        <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block px-3 py-1.5 rounded-full glass mb-5 border border-accent-green/40">
              <span className="text-accent-green text-xs font-semibold tracking-wide">
                AI-Powered Performance Coaching
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] mb-6">
              Train Smarter.
              <br />
              <span className="gradient-text">Run Faster.</span>
            </h1>
            <p className="text-lg text-gray-400 mb-8 max-w-lg leading-relaxed">
              A daily readiness score, an always-on AI coach, and training plans that adapt to your body — not the other way around.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => openAuth("register")}
                className="px-7 py-3.5 rounded-xl bg-accent-green text-black font-bold shadow-glow-green"
              >
                Get Started Free
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => openAuth("login")}
                className="px-7 py-3.5 rounded-xl glass-strong text-white font-semibold border border-white/15 hover:border-accent-green/60"
              >
                Sign In
              </motion.button>
            </div>
            <div className="mt-6 text-xs text-gray-500">
              Demo account: <span className="text-gray-300">demo@aisricoach.com</span> / <span className="text-gray-300">Demo1234!</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative h-72 sm:h-96 flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent-green/20 via-transparent to-accent-blue/20 rounded-full blur-3xl" />
            <div className="relative w-72 h-72 sm:w-96 sm:h-96">
              <RunnerSilhouette />
            </div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24 max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="glass-strong rounded-xl2 p-6 border border-white/10 hover:border-accent-green/40 transition"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-white">{f.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </main>
  );
}

function buildActions(score: number, tone: RingTone): { actions: string[]; tomorrow: string } {
  if (tone === "red") {
    return {
      actions: [
        "Skip intensity today — keep effort under conversational pace.",
        "Add 10 min of mobility + 8 hours of sleep tonight.",
      ],
      tomorrow: "Re-check AISRI in the morning before deciding tomorrow's workout.",
    };
  }
  if (tone === "yellow") {
    return {
      actions: [
        "Aerobic run 30–40 min, strict zone 2.",
        "Light strength: 2 sets of mobility + core only.",
      ],
      tomorrow: "If sleep > 7h, ramp back to a tempo session.",
    };
  }
  return {
    actions: [
      `Green-light intervals — score ${score} supports a quality session.`,
      "Hydrate early and pre-fuel 60–90 min before training.",
    ],
    tomorrow: "Plan an easy recovery jog to lock in adaptation.",
  };
}

function Dashboard() {
  const aisri = useAISRI();
  const workouts = useWorkouts();
  const { user } = useAuth();

  const data = aisri.data;
  const score = data?.score ?? 0;
  const status: AISRIData["status"] = data?.status ?? "ready";
  const tone: RingTone = (STATUS_TO_TONE[status as keyof typeof STATUS_TO_TONE] ?? 'yellow') as RingTone;
  const meta = TONE_META[tone];
  const insight = buildActions(score, tone);
  const todayWorkout = workouts.data?.[0];

  const trendValues = useMemo(() => {
    const seed = score || 60;
    return [seed - 14, seed - 6, seed - 9, seed - 2, seed + 1, seed - 4, seed].map((v) =>
      Math.max(0, Math.min(100, v)),
    );
  }, [score]);

  return (
    <main className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-7xl mx-auto">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
        className="space-y-6"
      >
        <motion.div
          variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
              {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold mt-1">
              Welcome back, <span className="gradient-text">{user?.name?.split(" ")[0] || "Athlete"}</span>
            </h1>
          </div>
          <Link
            href="/checkin"
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-accent-green/15 text-accent-green border border-accent-green/30 text-sm font-semibold hover:bg-accent-green/25 transition"
          >
            Daily check-in →
          </Link>
        </motion.div>

        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
          className="grid lg:grid-cols-3 gap-5"
        >
          <div className={`glass-strong rounded-xl2 p-6 flex flex-col items-center justify-center ${meta.glow}`}>
            {aisri.loading ? (
              <SkeletonCard className="w-60 h-60 rounded-full" height="" />
            ) : aisri.error ? (
              <div className="text-center">
                <div className="text-sm text-gray-300 mb-3">{aisri.error}</div>
                <button
                  onClick={aisri.retry}
                  className="px-4 py-2 rounded-lg bg-accent-blue/80 hover:bg-accent-blue text-white text-sm font-semibold"
                >
                  Retry
                </button>
              </div>
            ) : (
              <>
                <AISRIRing score={score} tone={tone} />
                <p className="mt-4 text-sm text-gray-300 text-center max-w-xs">{meta.line}</p>
              </>
            )}
          </div>

          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-5">
            {aisri.loading ? (
              <>
                <SkeletonCard height="h-44" />
                <SkeletonCard height="h-44" />
              </>
            ) : (
              <>
                <InsightCard
                  severity={SEVERITY_BY_TONE[tone]}
                  title="Top AI action"
                  explanation={meta.line}
                  actions={[insight.actions[0]]}
                  tomorrowGuidance={insight.tomorrow}
                />
                <InsightCard
                  severity={SEVERITY_BY_TONE[tone] === "low" ? "moderate" : SEVERITY_BY_TONE[tone]}
                  title="Recovery focus"
                  explanation="Small habits compound. Stack one of these on top of your day."
                  actions={[insight.actions[1] ?? "Aim for 8 hours of sleep tonight."]}
                />
              </>
            )}
          </div>
        </motion.div>

        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
          className="grid lg:grid-cols-3 gap-5"
        >
          <StreakPills workouts={workouts.data} />
          <div className="lg:col-span-2 glass-strong rounded-xl2 p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-200">Weekly AISRI trend</h3>
              <span className={`text-xs font-semibold ${meta.chip} px-2 py-0.5 rounded-full`}>
                {meta.label}
              </span>
            </div>
            <Sparkline values={trendValues} color={meta.stroke} />
            <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
              <span>7 days ago</span>
              <span>Today</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
          className="glass-strong rounded-xl2 p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Today&apos;s workout</h3>
            <Link href="/workouts" className="text-sm text-accent-green hover:underline">
              All workouts →
            </Link>
          </div>
          {workouts.loading ? (
            <SkeletonCard height="h-28" />
          ) : workouts.error ? (
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-gray-300">{workouts.error}</p>
              <button
                onClick={workouts.retry}
                className="px-4 py-2 rounded-lg bg-accent-blue/80 hover:bg-accent-blue text-white text-sm font-semibold"
              >
                Retry
              </button>
            </div>
          ) : todayWorkout ? (
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-accent-green/15 text-accent-green flex items-center justify-center text-2xl">
                🏃
              </div>
              <div className="flex-1">
                <div className="text-base font-semibold">{todayWorkout.title}</div>
                <div className="text-xs text-gray-400 capitalize">
                  {todayWorkout.type} · {todayWorkout.duration} min · {todayWorkout.difficulty}
                </div>
              </div>
              <Link
                href="/workouts"
                className="px-4 py-2 rounded-xl bg-accent-green text-black text-sm font-semibold hover:brightness-110 transition shadow-glow-green"
              >
                Start
              </Link>
            </div>
          ) : (
            <p className="text-sm text-gray-400">
              No workout queued. Generate one from the workouts page.
            </p>
          )}
        </motion.div>
      </motion.div>
    </main>
  );
}

export default function HomePage() {
  const { user } = useAuth();
  return user ? <Dashboard /> : <LoggedOutHero />;
}