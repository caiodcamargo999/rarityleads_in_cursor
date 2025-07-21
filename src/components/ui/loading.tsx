import { motion } from 'framer-motion'
import { Skeleton } from './skeleton'

interface LoadingProps {
  type?: 'spinner' | 'skeleton' | 'dots'
  message?: string
  className?: string
}

export function Loading({ type = 'spinner', message, className = '' }: LoadingProps) {
  if (type === 'skeleton') {
    return (
      <div className={`space-y-4 ${className}`}>
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    )
  }

  if (type === 'dots') {
    return (
      <div className={`flex items-center justify-center gap-1 ${className}`}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-[#8b5cf6] rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <motion.div
        className="w-8 h-8 border-2 border-[#8b5cf6] border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white text-sm"
        >
          {message}
        </motion.p>
      )}
    </div>
  )
}

// Dashboard skeleton loader
export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header skeleton */}
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>

        {/* Metrics grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>

        {/* Content skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    </div>
  )
} 