"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { submitCheckin } from "@/lib/api";

const FATIGUE_OPTIONS = [
  { value: 1, emoji: "😴", label: "Wrecked" },
  { value: 2, emoji: "😪", label: "Tired" },
  { value: 3, emoji: "😐", label: "Okay" },
  { value: 4, emoji: "🙂", label: "Good" },
  { value: 5, emoji: "💪", label: "Strong" },
];

const MOOD_OPTIONS = [
  { value: 1, emoji: "😞" },
  { value: 2, emoji: "😕" },
  { value: 3, emoji: "😌" },
  { value: 4, emoji: "😄" },
  { value: 5, emoji: "🤩" },
];

export default function CheckinPage() {
  const router = useRouter();
  const { user, openAuth } = useAuth();
  const [sleep, setSleep] = useState(7);
  const [fatigue, setFatigue] = useState(3);
  const [mood, setMood] = useState(3);
  const [injury, setInjury] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  if (!user) {
    return (
      <main className="px-4 sm:px-6 lg:px-8 py-12 max-w-3xl mx-auto">
        <div className="glass-strong rounded-xl2 p-8 text-center">
          <h1 className="text-2xl font-bold mb-2">Sign in to check in</h1>
          <p className="text-sm text-gray-400 mb-5">
            Daily check-ins power your AISRI score and AI coaching.
          </p>
          <button
            onClick={() => openAuth("login")}
            className="px-6 py-3 rounded-xl bg-accent-green text-black font-semibold shadow-glow-green"
          >
            Sign in
          </button>
        </div>
      </main>
    );
  }

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      await submitCheckin({
        sleep_hours: sleep,
        fatigue,
        mood,
        injury,
      });
      setToast("Check-in saved. Score updated.");
      setTimeout(() => router.push("/"), 800);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string | string[] } }; message?: string };
      const m = err?.response?.data?.message;
      setError(Array.isArray(m) ? m.join(", ") : m || err?.message || "Couldn't submit. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-3xl mx-auto">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
        className="space-y-6"
      >
        <motion.header
          variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
        >
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Daily check-in</p>
          <h1 className="text-3xl sm:text-4xl font-bold mt-1">
            How is your <span className="gradient-text">body</span> today?
          </h1>
          <p className="text-sm text-gray-400 mt-2">Takes 20 seconds. We'll re-score your AISRI instantly.</p>
        </motion.header>

        {/* Sleep */}
        <motion.section
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
          className="glass-strong rounded-xl2 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Sleep last night</h2>
            <motion.span
              key={sleep}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-2xl font-bold gradient-text tabular-nums"
            >
              {sleep.toFixed(1)}h
            </motion.span>
          </div>
          <input
            type="range"
            min={4}
            max={10}
            step={0.5}
            value={sleep}
            onChange={(e) => setSleep(parseFloat(e.target.value))}
            className="w-full accent-accent-green h-2 bg-white/10 rounded-full appearance-none cursor-pointer"
            aria-label="Sleep hours"
          />
          <div className="flex justify-between text-[10px] text-gray-500 mt-2">
            <span>4h</span>
            <span>7h</span>
            <span>10h</span>
          </div>
        </motion.section>

        {/* Fatigue */}
        <motion.section
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
          className="glass-strong rounded-xl2 p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Fatigue level</h2>
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {FATIGUE_OPTIONS.map((opt) => {
              const active = fatigue === opt.value;
              return (
                <motion.button
                  key={opt.value}
                  whileTap={{ scale: 0.94 }}
                  whileHover={{ y: -2 }}
                  animate={active ? { scale: [1, 1.06, 1] } : { scale: 1 }}
                  onClick={() => setFatigue(opt.value)}
                  className={`flex flex-col items-center gap-1 py-3 rounded-xl border transition ${
                    active
                      ? "bg-accent-green/15 border-accent-green/60 text-accent-green shadow-glow-green"
                      : "bg-white/5 border-white/10 text-gray-300 hover:border-white/30"
                  }`}
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <span className="text-[10px] uppercase tracking-wide">{opt.label}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.section>

        {/* Mood */}
        <motion.section
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
          className="glass-strong rounded-xl2 p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Mood</h2>
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {MOOD_OPTIONS.map((opt) => {
              const active = mood === opt.value;
              return (
                <motion.button
                  key={opt.value}
                  whileTap={{ scale: 0.94 }}
                  whileHover={{ y: -2 }}
                  animate={active ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                  onClick={() => setMood(opt.value)}
                  className={`flex items-center justify-center py-4 rounded-xl border transition ${
                    active
                      ? "bg-accent-blue/15 border-accent-blue/60 shadow-glow-blue"
                      : "bg-white/5 border-white/10 hover:border-white/30"
                  }`}
                  aria-label={`Mood ${opt.value}`}
                >
                  <span className="text-3xl">{opt.emoji}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.section>

        {/* Injury */}
        <motion.section
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
          className="glass-strong rounded-xl2 p-6 flex items-center justify-between"
        >
          <div>
            <h2 className="text-lg font-semibold">Any pain or injury?</h2>
            <p className="text-xs text-gray-400 mt-1">We'll cap intensity if yes.</p>
          </div>
          <button
            onClick={() => setInjury((v) => !v)}
            className={`relative w-14 h-8 rounded-full transition ${
              injury ? "bg-accent-red" : "bg-white/15"
            }`}
            aria-pressed={injury}
            aria-label="Injury toggle"
          >
            <motion.span
              layout
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow ${
                injury ? "left-7" : "left-1"
              }`}
            />
          </button>
        </motion.section>

        {error && (
          <div className="text-sm text-accent-red bg-accent-red/10 border border-accent-red/30 rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        <motion.button
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.01 }}
          onClick={submit}
          disabled={busy}
          className="w-full py-4 rounded-2xl bg-accent-green text-black font-bold text-lg shadow-glow-green disabled:opacity-60"
        >
          {busy ? "Saving…" : "Submit & calculate AISRI"}
        </motion.button>

        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-accent-green text-black text-sm font-semibold shadow-glow-green z-[150]"
          >
            {toast}
          </motion.div>
        )}
      </motion.div>
    </main>
  );
}