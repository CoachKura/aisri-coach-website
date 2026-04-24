'use client';

import { motion } from 'framer-motion';
import type { BiomechanicsData, BiomechanicsStatus } from '@/lib/types';

const statusConfig: Record<BiomechanicsStatus, { label: string; color: string; bar: string }> = {
  good: { label: 'Good', color: 'text-green-400', bar: 'bg-green-500' },
  warning: { label: 'Needs Work', color: 'text-amber-400', bar: 'bg-amber-500' },
  critical: { label: 'Critical', color: 'text-red-400', bar: 'bg-red-500' },
};

interface Props {
  data: BiomechanicsData;
}

export default function BiomechanicsPanel({ data }: Props) {
  return (
    <section id="biomechanics" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-5xl font-bold mb-4">
            Biomechanics <span className="gradient-text">Insights</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Real-time running form analysis and recommendations.
          </p>
        </motion.div>

        <div className="glass rounded-2xl p-8 border border-white/10">
          {/* Overall score */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
            <div>
              <p className="text-gray-400 text-sm">Overall Form Score</p>
              <p className="text-4xl font-bold gradient-text mt-1">{data.overallScore}</p>
            </div>
            <div className="w-24 h-24 relative">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="url(#bioGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 42}
                  initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                  whileInView={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - data.overallScore / 100) }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />
                <defs>
                  <linearGradient id="bioGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Insights grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {data.insights.map((insight, i) => {
              const cfg = statusConfig[insight.status];
              return (
                <motion.div
                  key={insight.metric}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  viewport={{ once: true }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{insight.metric}</span>
                    <span className={cfg.color}>{cfg.label}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${cfg.bar}`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${Math.min(insight.value, 100)}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: i * 0.08 }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-20 text-right">
                      {insight.value} {insight.unit}
                    </span>
                  </div>

                  {insight.status !== 'good' && (
                    <p className="text-xs text-gray-500">{insight.recommendation}</p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
