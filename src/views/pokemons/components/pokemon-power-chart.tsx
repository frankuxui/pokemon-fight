import { motion } from 'motion/react'

export default function PokkemonPowerChart ({ stats }: { stats: { base_stat: number }[] }) {
  const total = stats.reduce((acc, s) => acc + s.base_stat, 0)
  const max = 255 * stats.length
  const percentage = Math.round((total / max) * 100)

  const radius = 45
  const circumference = 2 * Math.PI * radius
  const progress = (percentage / 100) * circumference

  return (
    <div className="relative w-full h-full">
      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
        {/* Fondo gris */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="currentColor"
          strokeWidth="6"
          className="text-foreground/10 w-full h-full"
          fill="transparent"
        />
        {/* Progreso */}
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          stroke="currentColor"
          strokeWidth="6"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          className="w-full h-full text-violet-500"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />
      </svg>

      {/* Texto en el centro */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-base font-bold">{percentage}%</span>
      </div>
    </div>
  )
}
