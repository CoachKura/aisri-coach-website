'use client';

import { motion } from 'framer-motion';

interface AnimatedCircleProps {
  score?: number;
  status?: 'recovery' | 'moderate' | 'ready' | string;
  size?: 'sm' | 'md' | 'lg';
}

export default function AnimatedCircle({
  score = 72,
  status = 'ready',
  size = 'lg',
}: AnimatedCircleProps) {
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-40 h-40',
    lg: 'w-56 h-56',
  };

  const statusColors = {
    recovery: { bg: 'from-red-600 to-red-500', text: 'Ready for Recovery' },
    moderate: { bg: 'from-amber-600 to-amber-500', text: 'Controlled Training' },
    ready: { bg: 'from-green-600 to-emerald-500', text: 'Ready for Training' },
  };

  const circumference = 2 * Math.PI * 90;
  const offset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="flex flex-col items-center"
    >
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Outer glow */}
        <motion.div
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${(statusColors[status as keyof typeof statusColors] ?? statusColors.recovery).bg} blur-2xl opacity-40`}
        />

        {/* Main circle container */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="8"
          />

          {/* Progress circle */}
          <motion.circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <motion.div
              animate={{ y: [-2, 2, -2] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-5xl sm:text-6xl font-bold gradient-text"
            >
              {score}
            </motion.div>
            <p className="text-xs sm:text-sm text-gray-400 mt-2">AISRI Score</p>
            <p className={`text-xs mt-1 font-medium`}>
              {(statusColors[status as keyof typeof statusColors] ?? statusColors.recovery).text}
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
