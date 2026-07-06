"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import type { ReactNode } from "react";

/* -------------------------------------------------------------------------- */
/*  Inline SVG icons (no emoji, per design guidelines)                        */
/* -------------------------------------------------------------------------- */

type IconProps = { className?: string };

function BoltIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 2 4.5 13.5H11l-1 8.5L19.5 10H13l0-8Z" />
    </svg>
  );
}

function PulseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 12h4l2-6 4 14 2-8h6" />
    </svg>
  );
}

function ChartIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </svg>
  );
}

function ShieldIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4" />
    </svg>
  );
}

function CompassIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
    </svg>
  );
}

function UsersIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 20v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1" />
      <circle cx="9.5" cy="8" r="3.2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 20v-1a4 4 0 0 0-3-3.85M16.5 5.2a3.2 3.2 0 0 1 0 5.6" />
    </svg>
  );
}

function CheckIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  );
}

function ArrowIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Data                                                                       */
/* -------------------------------------------------------------------------- */

const STATS = [
  { value: "48k+", label: "Sessions analyzed" },
  { value: "23%", label: "Avg. pace gain" },
  { value: "0.4s", label: "Real-time scoring" },
  { value: "94%", label: "Stay injury-free" },
];

// Full class strings kept literal so Tailwind's content scanner detects them.
const FEATURES: { icon: (p: IconProps) => ReactNode; title: string; body: string; glow: string }[] = [
  {
    icon: PulseIcon,
    title: "Live AISRI Scoring",
    body: "Every stride is scored in real time against your biomechanical baseline, so you feel form breakdowns before they cost you.",
    glow: "group-hover:shadow-glow-green",
  },
  {
    icon: ChartIcon,
    title: "Adaptive Training Plans",
    body: "Plans that rewrite themselves nightly from your sleep, load, and recovery data — never generic, never stale.",
    glow: "group-hover:shadow-glow-blue",
  },
  {
    icon: ShieldIcon,
    title: "Injury Prevention",
    body: "Asymmetry and fatigue models flag the risk window days ahead and automatically dial back your volume.",
    glow: "group-hover:shadow-glow-yellow",
  },
  {
    icon: CompassIcon,
    title: "Biomechanics Lab",
    body: "Frame-by-frame gait breakdowns with cueing you can actually apply on your next easy run.",
    glow: "group-hover:shadow-glow-blue",
  },
  {
    icon: BoltIcon,
    title: "Instant Coach Chat",
    body: "Ask anything mid-block. Your AI coach answers with the context of every session you've ever logged.",
    glow: "group-hover:shadow-glow-green",
  },
  {
    icon: UsersIcon,
    title: "Squad Challenges",
    body: "Train alongside a pod of athletes at your level with shared leaderboards and weekly accountability.",
    glow: "group-hover:shadow-glow-red",
  },
];

const STEPS = [
  { n: "01", title: "Connect", body: "Link your watch or phone. We import history and build your baseline in minutes." },
  { n: "02", title: "Calibrate", body: "A short benchmark run tunes the AISRI model to your unique gait and goals." },
  { n: "03", title: "Train", body: "Follow adaptive sessions with live cues, then let the plan evolve with every result." },
];

const TESTIMONIALS = [
  {
    quote: "The live scoring caught my collapsing hip weeks before it would've become an injury. First marathon block I've finished healthy.",
    name: "Maya R.",
    role: "2:58 marathoner",
  },
  {
    quote: "It feels like a coach who actually remembers everything. The plan adjusts before I even realize I'm overreaching.",
    name: "Dominic K.",
    role: "Age-group triathlete",
  },
  {
    quote: "I've used three coaching apps. This is the only one where the feedback changed how I actually run.",
    name: "Priya S.",
    role: "Sub-20 5k",
  },
];

const PLANS = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    tagline: "Get your baseline",
    features: ["AISRI scoring on 4 runs / month", "Weekly summary", "Community pods"],
    cta: "Start free",
    featured: false,
  },
  {
    name: "Athlete",
    price: "$19",
    period: "/mo",
    tagline: "For serious training blocks",
    features: [
      "Unlimited live scoring",
      "Adaptive daily plans",
      "Injury-risk alerts",
      "Biomechanics lab",
      "Priority coach chat",
    ],
    cta: "Start 14-day trial",
    featured: true,
  },
  {
    name: "Elite",
    price: "$49",
    period: "/mo",
    tagline: "Human + AI coaching",
    features: ["Everything in Athlete", "Monthly human coach review", "Race-day pacing strategy", "Video gait audit"],
    cta: "Talk to us",
    featured: false,
  },
];

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function SamplePage() {
  const reduce = useReducedMotion();

  const fadeUp = {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <main className="relative overflow-hidden">
      {/* Ambient background blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-blob" />
        <div className="absolute top-40 right-0 h-80 w-80 rounded-full bg-secondary/20 blur-3xl animate-blob" style={{ animationDelay: "3s" }} />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-accent-blue/20 blur-3xl animate-blob" style={{ animationDelay: "6s" }} />
      </div>

      {/* ---------------------------------------------------------------- HERO */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-24 text-center sm:pt-28">
        <motion.div initial="hidden" animate="show" variants={fadeUp} transition={{ duration: 0.6 }}>
          <span className="inline-flex items-center gap-2 rounded-full glass-sm px-4 py-1.5 text-sm font-medium text-primary">
            <span className="h-2 w-2 rounded-full bg-accent-green animate-pulse" />
            New · AISRI 2.0 real-time engine
          </span>
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mx-auto mt-6 max-w-4xl text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl"
        >
          Train smarter. <span className="gradient-text">Run faster.</span>
          <br /> Stay unbroken.
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-dark-300 sm:text-xl"
        >
          An AI performance coach that scores every stride, rewrites your plan nightly, and flags
          injuries before they happen — built on real biomechanics, not generic templates.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="#pricing"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 font-semibold text-dark-950 shadow-glow-green transition-transform duration-200 hover:scale-[1.03] focus-visible:scale-[1.03]"
          >
            Start training free
            <ArrowIcon className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
          <Link
            href="#how"
            className="inline-flex items-center gap-2 rounded-full glass px-8 py-3.5 font-semibold text-gray-100 transition-colors duration-200 hover:bg-white/10"
          >
            See how it works
          </Link>
        </motion.div>

        {/* Stats strip */}
        <motion.dl
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="mx-auto mt-20 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {STATS.map((s) => (
            <div key={s.label} className="glass rounded-2xl px-4 py-6">
              <dd className="text-3xl font-extrabold gradient-text sm:text-4xl">{s.value}</dd>
              <dt className="mt-1 text-sm text-dark-400">{s.label}</dt>
            </div>
          ))}
        </motion.dl>
      </section>

      {/* ------------------------------------------------------------ FEATURES */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading eyebrow="Capabilities" title="Everything a great coach does — at machine speed" />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.article
                key={f.title}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                variants={fadeUp}
                transition={{ duration: 0.5, delay: reduce ? 0 : (i % 3) * 0.08 }}
                className="group glass rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.08]"
              >
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-primary transition-shadow duration-300 ${f.glow}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-bold">{f.title}</h3>
                <p className="mt-2 text-dark-300">{f.body}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* ----------------------------------------------------------- HOW IT WORKS */}
      <section id="how" className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading eyebrow="How it works" title="From first run to full send in three steps" />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              transition={{ duration: 0.5, delay: reduce ? 0 : i * 0.1 }}
              className="relative glass rounded-2xl p-8"
            >
              <span className="text-5xl font-extrabold text-white/10">{step.n}</span>
              <h3 className="mt-3 text-xl font-bold">{step.title}</h3>
              <p className="mt-2 text-dark-300">{step.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------- TESTIMONIALS */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading eyebrow="Loved by athletes" title="Real gains, healthier seasons" />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={t.name}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              transition={{ duration: 0.5, delay: reduce ? 0 : i * 0.08 }}
              className="glass rounded-2xl p-7"
            >
              <div className="flex gap-1 text-accent-yellow" aria-hidden>
                {Array.from({ length: 5 }).map((_, s) => (
                  <svg key={s} viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path d="m12 2 3 6.6 7.2.8-5.4 4.9 1.5 7.1L12 17.8 5.7 21.4l1.5-7.1L1.8 9.4 9 8.6 12 2Z" />
                  </svg>
                ))}
              </div>
              <blockquote className="mt-4 text-gray-100">“{t.quote}”</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary font-bold text-dark-950">
                  {t.name.charAt(0)}
                </span>
                <span>
                  <span className="block font-semibold">{t.name}</span>
                  <span className="block text-sm text-dark-400">{t.role}</span>
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------------- PRICING */}
      <section id="pricing" className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading eyebrow="Pricing" title="Start free. Upgrade when you're chasing a PR." />
        <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-3">
          {PLANS.map((p, i) => (
            <motion.div
              key={p.name}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              transition={{ duration: 0.5, delay: reduce ? 0 : i * 0.08 }}
              className={`relative flex flex-col rounded-2xl p-8 ${
                p.featured ? "glass-strong ring-1 ring-primary/50 shadow-glow-green" : "glass"
              }`}
            >
              {p.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-bold text-dark-950">
                  Most popular
                </span>
              )}
              <h3 className="text-lg font-semibold text-dark-200">{p.name}</h3>
              <p className="mt-3">
                <span className="text-4xl font-extrabold">{p.price}</span>
                <span className="text-dark-400">{p.period}</span>
              </p>
              <p className="mt-1 text-sm text-dark-400">{p.tagline}</p>
              <ul className="mt-6 space-y-3 text-sm">
                {p.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2.5">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-dark-200">{feat}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/checkin"
                className={`mt-8 inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold transition-transform duration-200 hover:scale-[1.03] focus-visible:scale-[1.03] ${
                  p.featured
                    ? "bg-primary text-dark-950 shadow-glow-green"
                    : "glass text-gray-100 hover:bg-white/10"
                }`}
              >
                {p.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------ FINAL CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-28 pt-10">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl glass-strong px-8 py-16 text-center"
        >
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/25 blur-3xl" />
          </div>
          <h2 className="mx-auto max-w-2xl text-3xl font-extrabold sm:text-5xl">
            Your next season starts with <span className="gradient-text">one run.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-dark-300">
            Connect your watch and get your first AISRI score in under five minutes. No card required.
          </p>
          <Link
            href="/checkin"
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 font-semibold text-dark-950 shadow-glow-green transition-transform duration-200 hover:scale-[1.03] focus-visible:scale-[1.03]"
          >
            Get my first score
            <ArrowIcon className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </section>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/*  Shared section heading                                                     */
/* -------------------------------------------------------------------------- */

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="text-sm font-semibold uppercase tracking-widest text-primary">{eyebrow}</span>
      <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">{title}</h2>
    </div>
  );
}
