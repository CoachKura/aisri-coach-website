"use client";

import { motion } from "framer-motion";
import AnimatedCircle from "@/components/AnimatedCircle";
import Card from "@/components/Card";
import WorkoutPreview from "@/components/WorkoutPreview";
import BiomechanicsPanel from "@/components/BiomechanicsPanel";
import { useAISRI, useWorkouts, useBiomechanics } from "@/hooks/useApi";
import { useAuth } from "@/lib/auth-context";

const SAMPLE_BIOMECHANICS_INPUT = {
  cadence: 172,
  strideLength: 1.35,
  groundContactTime: 240,
  verticalOscillation: 8.2,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

function Spinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="glass rounded-lg px-4 py-3 border border-red-500/40 text-red-400 text-sm text-center">
      {message}
    </div>
  );
}

export default function Home() {
  const aisri = useAISRI();
  const workouts = useWorkouts();
  const biomechanics = useBiomechanics(SAMPLE_BIOMECHANICS_INPUT);
  const { isAuthed, user, openAuth, logout } = useAuth();

  const score = aisri.data?.score ?? 72;
  const status = aisri.data?.status ?? "ready";

  return (
    <main className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="absolute top-20 -left-40 w-80 h-80 bg-green-500/20 rounded-full blur-3xl opacity-20 animate-blob" />
        <div className="absolute bottom-20 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="relative z-10 max-w-5xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <div className="inline-block px-4 py-2 rounded-full glass mb-6 border border-green-500/50">
              <span className="text-green-400 text-sm font-medium">
                AI-Powered Performance Coaching
              </span>
            </div>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            Train Smarter.
            <br />
            <span className="gradient-text">Run Injury-Free.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Real-time AISRI scoring, biomechanics analysis, and adaptive training powered by AI.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <button onClick={() => isAuthed ? logout() : openAuth("register")} className="px-8 py-3 rounded-lg bg-green-600 hover:bg-green-700 font-semibold transition-colors text-white">
              {isAuthed ? `Sign out (${user?.name ?? user?.email ?? ""})` : "Get Started Free"}
            </button>
            <button onClick={() => openAuth("login")} className="px-8 py-3 rounded-lg glass border border-gray-600 hover:border-green-500 font-semibold transition-colors">
              {isAuthed ? "Refresh data" : "Sign in"}
            </button>
          </motion.div>

          {/* AISRI Circle — live data */}
          <motion.div variants={itemVariants} className="flex flex-col items-center gap-4">
            {aisri.loading ? (
              <Spinner />
            ) : aisri.error ? (
              <>
                <ErrorBanner message={`AISRI: ${aisri.error}`} />
                <AnimatedCircle score={score} status={status} size="lg" />
              </>
            ) : (
              <>
                <AnimatedCircle score={score} status={status} size="lg" />
                {aisri.data?.pillars && aisri.data.pillars.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-3 mt-4">
                    {aisri.data.pillars.map((p) => (
                      <div
                        key={p.name}
                        className="glass rounded-lg px-3 py-1.5 text-xs border border-white/10"
                      >
                        <span className="text-gray-400">{p.name}</span>
                        <span className="ml-2 font-semibold gradient-text">{p.score}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">
              Powerful <span className="gradient-text">Features</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Everything you need to optimize your training.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <Card title="AISRI Score" description="Real-time readiness assessment" delay={0} />
            <Card title="Biomechanics" description="Running form analysis with recommendations" delay={0.1} />
            <Card title="Adaptive Training" description="AI-powered training plans" delay={0.2} />
            <Card title="Injury Prevention" description="Proactive alerts and insights" delay={0.3} />
          </motion.div>
        </div>
      </section>

      {/* Workout Preview — live data */}
      {workouts.loading ? (
        <div className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-bold mb-8 text-center">
              Today&apos;s <span className="gradient-text">Workouts</span>
            </h2>
            <Spinner />
          </div>
        </div>
      ) : workouts.error ? (
        <div className="py-20 px-4 max-w-7xl mx-auto">
          <ErrorBanner message={`Workouts: ${workouts.error}`} />
        </div>
      ) : workouts.data && workouts.data.length > 0 ? (
        <WorkoutPreview workouts={workouts.data} />
      ) : null}

      {/* Biomechanics Panel — live data */}
      {biomechanics.loading ? (
        <div className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-bold mb-8 text-center">
              Biomechanics <span className="gradient-text">Insights</span>
            </h2>
            <Spinner />
          </div>
        </div>
      ) : biomechanics.error ? (
        <div className="py-20 px-4 max-w-7xl mx-auto">
          <ErrorBanner message={`Biomechanics: ${biomechanics.error}`} />
        </div>
      ) : biomechanics.data ? (
        <BiomechanicsPanel data={biomechanics.data} />
      ) : null}

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Connect", description: "Link your devices" },
              { step: "02", title: "Analyze", description: "AI analysis" },
              { step: "03", title: "Adapt", description: "Get recommendations" },
              { step: "04", title: "Improve", description: "Track progress" },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass rounded-xl p-6 text-center"
              >
                <div className="text-4xl font-bold gradient-text mb-2">{item.step}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="glass rounded-2xl p-12 border border-green-500/50 bg-gradient-to-br from-green-500/10 to-emerald-500/10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Transform Your <span className="gradient-text">Training?</span>
            </h2>
            <p className="text-gray-400 mb-8 text-lg">
              Join athletes training smarter with AISRI Coach.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 rounded-lg bg-green-600 hover:bg-green-700 font-semibold transition-colors">
                Get Started Free
              </button>
              <button className="px-8 py-3 rounded-lg glass border border-gray-600 hover:border-green-500 font-semibold transition-colors">
                Schedule Demo
              </button>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
