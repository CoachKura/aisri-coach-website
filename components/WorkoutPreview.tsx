'use client';

import { motion } from 'framer-motion';
import type { Workout } from '@/lib/types';

const difficultyColor = {
  easy: 'text-green-400 bg-green-400/10',
  moderate: 'text-amber-400 bg-amber-400/10',
  hard: 'text-red-400 bg-red-400/10',
};

interface Props {
  workouts: Workout[];
}

export default function WorkoutPreview({ workouts }: Props) {
  return (
    <section id="workouts" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-5xl font-bold mb-4">
            Today&apos;s <span className="gradient-text">Workouts</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            AI-curated sessions based on your current readiness.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workouts.map((workout, i) => (
            <motion.div
              key={workout.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="glass rounded-xl p-6 border border-white/10 hover:border-green-500/40 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{workout.title}</h3>
                  <p className="text-gray-400 text-sm mt-1">{workout.type}</p>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${difficultyColor[workout.difficulty]}`}
                >
                  {workout.difficulty}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                <span>{workout.duration} min</span>
                <span>•</span>
                <span>{workout.exercises.length} exercises</span>
              </div>

              <ul className="space-y-1">
                {workout.exercises.slice(0, 3).map((ex, j) => (
                  <li key={j} className="text-sm text-gray-300 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-green-400 flex-shrink-0" />
                    {ex.name}
                    {ex.sets && ex.reps && (
                      <span className="text-gray-500 ml-auto">
                        {ex.sets}×{ex.reps}
                      </span>
                    )}
                    {ex.duration && (
                      <span className="text-gray-500 ml-auto">{ex.duration}</span>
                    )}
                  </li>
                ))}
                {workout.exercises.length > 3 && (
                  <li className="text-xs text-gray-500 pt-1">
                    +{workout.exercises.length - 3} more exercises
                  </li>
                )}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
