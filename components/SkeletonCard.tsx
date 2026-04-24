"use client";

interface SkeletonCardProps {
  className?: string;
  height?: string;
}

export default function SkeletonCard({ className = "", height = "h-32" }: SkeletonCardProps) {
  return (
    <div
      className={`shimmer rounded-xl2 border border-white/5 ${height} ${className}`}
      aria-hidden="true"
    />
  );
}