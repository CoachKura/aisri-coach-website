'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
  icon?: ReactNode;
  title: string;
  description: string;
  gradient?: string;
  delay?: number;
}

export default function Card({
  icon,
  title,
  description,
  gradient = 'from-green-500/20 to-emerald-500/20',
  delay = 0,
}: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={`glass rounded-2xl p-6 sm:p-8 border border-gray-700/50 hover:border-green-500/50 transition-all group cursor-pointer`}
    >
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300 -z-10`} />

      {/* Icon */}
      {icon && (
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-green-500/20 flex items-center justify-center mb-4 group-hover:bg-green-500/30 transition-all"
        >
          {icon}
        </motion.div>
      )}

      {/* Content */}
      <h3 className="text-lg sm:text-xl font-semibold mb-2 group-hover:text-green-400 transition-colors">
        {title}
      </h3>
      <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
        {description}
      </p>

      {/* Hover indicator */}
      <div className="mt-4 flex items-center text-green-400 opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
        Learn more
        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </motion.div>
  );
}
