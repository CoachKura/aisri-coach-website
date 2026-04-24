"use client";

import { motion } from "framer-motion";

export type InsightSeverity = "low" | "moderate" | "high";

interface InsightCardProps {
  severity: InsightSeverity;
  title: string;
  explanation: string;
  actions: string[];
  tomorrowGuidance?: string;
}

const SEVERITY_STYLES: Record<
  InsightSeverity,
  { border: string; glow: string; chip: string; icon: string; label: string }
> = {
  low: {
    border: "border-l-accent-green",
    glow: "shadow-glow-green",
    chip: "bg-accent-green/15 text-accent-green",
    icon: "🟢",
    label: "All good",
  },
  moderate: {
    border: "border-l-accent-yellow",
    glow: "shadow-glow-yellow",
    chip: "bg-accent-yellow/15 text-accent-yellow",
    icon: "🟡",
    label: "Heads up",
  },
  high: {
    border: "border-l-accent-red",
    glow: "shadow-glow-red",
    chip: "bg-accent-red/15 text-accent-red",
    icon: "🔴",
    label: "Take action",
  },
};

export default function InsightCard({
  severity,
  title,
  explanation,
  actions,
  tomorrowGuidance,
}: InsightCardProps) {
  const s = SEVERITY_STYLES[severity];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      whileHover={{ y: -3 }}
      className={`glass-strong rounded-xl2 border-l-4 ${s.border} ${s.glow} p-5 sm:p-6`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl leading-none" aria-hidden="true">{s.icon}</span>
          <h3 className="text-base sm:text-lg font-semibold text-white">{title}</h3>
        </div>
        <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-full ${s.chip}`}>
          {s.label}
        </span>
      </div>

      <p className="text-sm text-gray-300 leading-relaxed mb-4">{explanation}</p>

      {actions.length > 0 && (
        <ul className="space-y-2 mb-3">
          {actions.map((a, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-200">
              <span className="mt-1 inline-block w-1.5 h-1.5 rounded-full bg-white/60 flex-shrink-0" />
              <span>{a}</span>
            </li>
          ))}
        </ul>
      )}

      {tomorrowGuidance && (
        <div className="mt-3 pt-3 border-t border-white/10 text-xs text-gray-400">
          <span className="font-semibold text-gray-300">Tomorrow:</span> {tomorrowGuidance}
        </div>
      )}
    </motion.div>
  );
}