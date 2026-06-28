"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";

type Units = "metric" | "imperial";
type Goal = "race" | "fitness" | "weight" | "injury";

interface Settings {
  displayName: string;
  units: Units;
  weeklyGoalKm: number;
  goal: Goal;
  notifyCheckin: boolean;
  notifyWeekly: boolean;
  notifyInjury: boolean;
  shareData: boolean;
  reduceMotion: boolean;
}

const DEFAULTS: Settings = {
  displayName: "",
  units: "metric",
  weeklyGoalKm: 40,
  goal: "fitness",
  notifyCheckin: true,
  notifyWeekly: true,
  notifyInjury: true,
  shareData: false,
  reduceMotion: false,
};

const GOAL_OPTIONS: { value: Goal; emoji: string; label: string }[] = [
  { value: "race", emoji: "🏁", label: "Race PB" },
  { value: "fitness", emoji: "⚡", label: "Fitness" },
  { value: "weight", emoji: "⚖️", label: "Weight" },
  { value: "injury", emoji: "🛡️", label: "Injury-free" },
];

const STORAGE_KEY = "aisri_settings";

function loadSettings(): Settings {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return DEFAULTS;
}

/* Animated toggle matching the check-in page style */
function Toggle({
  on,
  onChange,
  tone = "green",
  label,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  tone?: "green" | "blue" | "red";
  label: string;
}) {
  const toneBg = tone === "blue" ? "bg-accent-blue" : tone === "red" ? "bg-accent-red" : "bg-accent-green";
  return (
    <button
      onClick={() => onChange(!on)}
      className={`relative w-14 h-8 rounded-full transition shrink-0 ${on ? toneBg : "bg-white/15"}`}
      aria-pressed={on}
      aria-label={label}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow ${on ? "left-7" : "left-1"}`}
      />
    </button>
  );
}

function Row({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div className="min-w-0">
        <div className="text-sm font-semibold text-white">{title}</div>
        {desc && <div className="text-xs text-gray-400 mt-0.5">{desc}</div>}
      </div>
      {children}
    </div>
  );
}

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export default function SettingsPage() {
  const { user, openAuth, logout } = useAuth();
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [initial, setInitial] = useState<Settings>(DEFAULTS);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const loaded = loadSettings();
    const withName = { ...loaded, displayName: loaded.displayName || user?.name || "" };
    setSettings(withName);
    setInitial(withName);
  }, [user]);

  const dirty = useMemo(
    () => JSON.stringify(settings) !== JSON.stringify(initial),
    [settings, initial],
  );

  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings((s) => ({ ...s, [key]: value }));
  }

  function save() {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }
    setInitial(settings);
    setToast("Settings saved");
    setTimeout(() => setToast(null), 2200);
  }

  function reset() {
    setSettings(initial);
  }

  if (!user) {
    return (
      <main className="px-4 sm:px-6 lg:px-8 py-12 max-w-3xl mx-auto">
        <div className="glass-strong rounded-xl2 p-8 text-center">
          <h1 className="text-2xl font-bold mb-2">Sign in to manage settings</h1>
          <p className="text-sm text-gray-400 mb-5">
            Your preferences, goals, and notifications live with your account.
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

  const initials =
    settings.displayName.trim().split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase() || "AT";
  const weeklyDisplay =
    settings.units === "metric"
      ? `${settings.weeklyGoalKm} km`
      : `${Math.round(settings.weeklyGoalKm * 0.621371)} mi`;

  return (
    <main className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-3xl mx-auto">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
        className="space-y-6 pb-24"
      >
        {/* Header */}
        <motion.header variants={sectionVariants}>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Account</p>
          <h1 className="text-3xl sm:text-4xl font-bold mt-1">
            <span className="gradient-text">Settings</span>
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Tune your profile, training targets, and how AISRI talks to you.
          </p>
        </motion.header>

        {/* Profile */}
        <motion.section variants={sectionVariants} className="glass-strong rounded-xl2 p-6">
          <h2 className="text-lg font-semibold mb-4">Profile</h2>
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-green to-accent-blue flex items-center justify-center text-black font-bold text-xl shadow-glow-green">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="text-base font-semibold text-white truncate">
                {settings.displayName || "Athlete"}
              </div>
              <div className="text-xs text-gray-400 truncate">{user.email}</div>
            </div>
          </div>
          <label className="text-xs text-gray-400">Display name</label>
          <input
            type="text"
            value={settings.displayName}
            onChange={(e) => update("displayName", e.target.value)}
            placeholder="Your name"
            className="w-full mt-1 px-3 py-2.5 rounded-lg bg-gray-950 border border-gray-700 focus:border-accent-green focus:outline-none text-white placeholder-gray-500 [color-scheme:dark]"
          />
          <div className="mt-4">
            <label className="text-xs text-gray-400">Email</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full mt-1 px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 cursor-not-allowed"
            />
            <p className="text-[11px] text-gray-500 mt-1">Email is tied to your login and can't be changed here.</p>
          </div>
        </motion.section>

        {/* Training preferences */}
        <motion.section variants={sectionVariants} className="glass-strong rounded-xl2 p-6">
          <h2 className="text-lg font-semibold mb-4">Training</h2>

          <label className="text-xs text-gray-400">Units</label>
          <div className="grid grid-cols-2 gap-2 mt-1.5 mb-5">
            {(["metric", "imperial"] as Units[]).map((u) => {
              const active = settings.units === u;
              return (
                <motion.button
                  key={u}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => update("units", u)}
                  className={`py-2.5 rounded-xl border text-sm font-medium capitalize transition ${
                    active
                      ? "bg-accent-green/15 border-accent-green/60 text-accent-green"
                      : "bg-white/5 border-white/10 text-gray-300 hover:border-white/30"
                  }`}
                >
                  {u === "metric" ? "Metric (km)" : "Imperial (mi)"}
                </motion.button>
              );
            })}
          </div>

          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-gray-400">Weekly distance goal</label>
            <motion.span
              key={weeklyDisplay}
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              className="text-lg font-bold gradient-text tabular-nums"
            >
              {weeklyDisplay}
            </motion.span>
          </div>
          <input
            type="range"
            min={10}
            max={120}
            step={5}
            value={settings.weeklyGoalKm}
            onChange={(e) => update("weeklyGoalKm", parseInt(e.target.value, 10))}
            className="w-full accent-accent-green h-2 bg-white/10 rounded-full appearance-none cursor-pointer"
            aria-label="Weekly distance goal"
          />

          <label className="text-xs text-gray-400 block mt-6 mb-2">Primary goal</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {GOAL_OPTIONS.map((g) => {
              const active = settings.goal === g.value;
              return (
                <motion.button
                  key={g.value}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ y: -2 }}
                  onClick={() => update("goal", g.value)}
                  className={`flex flex-col items-center gap-1 py-3 rounded-xl border transition ${
                    active
                      ? "bg-accent-blue/15 border-accent-blue/60 text-white shadow-glow-blue"
                      : "bg-white/5 border-white/10 text-gray-300 hover:border-white/30"
                  }`}
                >
                  <span className="text-2xl">{g.emoji}</span>
                  <span className="text-[10px] uppercase tracking-wide">{g.label}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.section>

        {/* Notifications */}
        <motion.section variants={sectionVariants} className="glass-strong rounded-xl2 p-6">
          <h2 className="text-lg font-semibold mb-1">Notifications</h2>
          <p className="text-xs text-gray-400 mb-2">Choose what AISRI nudges you about.</p>
          <div className="divide-y divide-white/5">
            <Row title="Daily check-in reminder" desc="A gentle morning ping to log how you feel.">
              <Toggle on={settings.notifyCheckin} onChange={(v) => update("notifyCheckin", v)} label="Daily check-in reminder" />
            </Row>
            <Row title="Weekly summary" desc="Your AISRI trend and mileage recap every Sunday.">
              <Toggle on={settings.notifyWeekly} onChange={(v) => update("notifyWeekly", v)} tone="blue" label="Weekly summary" />
            </Row>
            <Row title="Injury alerts" desc="Early warnings when fatigue or load spikes.">
              <Toggle on={settings.notifyInjury} onChange={(v) => update("notifyInjury", v)} tone="red" label="Injury alerts" />
            </Row>
          </div>
        </motion.section>

        {/* Privacy & appearance */}
        <motion.section variants={sectionVariants} className="glass-strong rounded-xl2 p-6">
          <h2 className="text-lg font-semibold mb-1">Privacy &amp; display</h2>
          <div className="divide-y divide-white/5">
            <Row title="Share anonymised data" desc="Help improve the model. Never sold, never identifiable.">
              <Toggle on={settings.shareData} onChange={(v) => update("shareData", v)} tone="blue" label="Share anonymised data" />
            </Row>
            <Row title="Reduce motion" desc="Tone down animations across the app.">
              <Toggle on={settings.reduceMotion} onChange={(v) => update("reduceMotion", v)} label="Reduce motion" />
            </Row>
          </div>
        </motion.section>

        {/* Danger zone */}
        <motion.section
          variants={sectionVariants}
          className="rounded-xl2 p-6 border border-accent-red/30 bg-accent-red/5"
        >
          <h2 className="text-lg font-semibold mb-1 text-accent-red">Danger zone</h2>
          <p className="text-xs text-gray-400 mb-4">Sign out of this device or end your session.</p>
          <button
            onClick={() => logout()}
            className="px-5 py-2.5 rounded-xl border border-accent-red/50 text-accent-red text-sm font-semibold hover:bg-accent-red/15 transition"
          >
            Sign out
          </button>
        </motion.section>
      </motion.div>

      {/* Sticky save bar */}
      <motion.div
        initial={false}
        animate={{ y: dirty ? 0 : 120, opacity: dirty ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        className="fixed inset-x-0 bottom-0 z-[120] px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pointer-events-none"
      >
        <div className="max-w-3xl mx-auto glass-strong rounded-2xl border border-white/10 px-4 py-3 flex items-center justify-between gap-3 pointer-events-auto shadow-2xl">
          <span className="text-sm text-gray-300">You have unsaved changes</span>
          <div className="flex items-center gap-2">
            <button
              onClick={reset}
              className="px-4 py-2 rounded-lg border border-white/15 text-sm text-gray-200 hover:border-white/30 transition"
            >
              Discard
            </button>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={save}
              className="px-5 py-2 rounded-lg bg-accent-green text-black text-sm font-bold shadow-glow-green"
            >
              Save changes
            </motion.button>
          </div>
        </div>
      </motion.div>

      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-accent-green text-black text-sm font-semibold shadow-glow-green z-[150]"
        >
          {toast}
        </motion.div>
      )}
    </main>
  );
}
