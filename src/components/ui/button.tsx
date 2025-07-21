"use client"

import { motion, HTMLMotionProps } from 'framer-motion'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { buttonVariants, motionVariants } from '@/lib/design-system'

export interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'glass'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  children: React.ReactNode
  className?: string
  fullWidth?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const sizeVariants = {
  sm: "px-3 py-2 text-sm rounded-md font-normal",
  md: "px-4 py-2 text-base rounded-lg font-normal",
  lg: "px-6 py-3 text-lg rounded-lg font-normal",
  xl: "px-8 py-4 text-xl rounded-xl font-normal"
}

const glassVariants = {
  primary: "bg-gradient-to-r from-purple-500/20 to-purple-600/20 backdrop-blur-xl border border-purple-500/30 text-white hover:from-purple-500/30 hover:to-purple-600/30 hover:border-purple-400/50",
  secondary: "bg-gradient-to-r from-gray-500/10 to-gray-600/10 backdrop-blur-xl border border-gray-500/30 text-gray-200 hover:from-gray-500/20 hover:to-gray-600/20 hover:border-gray-400/50",
  success: "bg-gradient-to-r from-green-500/20 to-green-600/20 backdrop-blur-xl border border-green-500/30 text-green-200 hover:from-green-500/30 hover:to-green-600/30 hover:border-green-400/50",
  danger: "bg-gradient-to-r from-red-500/20 to-red-600/20 backdrop-blur-xl border border-red-500/30 text-red-200 hover:from-red-500/30 hover:to-red-600/30 hover:border-red-400/50"
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    children, 
    className, 
    disabled,
    fullWidth = false,
    icon,
    iconPosition = 'left',
    ...props 
  }, ref) => {
    const baseClasses = cn(
      "inline-flex items-center justify-center transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed font-normal relative overflow-hidden",
      sizeVariants[size],
      fullWidth && "w-full",
      className
    )

    const getVariantClasses = () => {
      if (variant === 'glass') {
        return glassVariants.primary
      }
      
      switch (variant) {
        case 'primary':
          return "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-105 active:scale-95"
        case 'secondary':
          return "bg-transparent text-purple-400 border border-purple-500/50 hover:bg-purple-500/10 hover:border-purple-400 hover:text-purple-300"
        case 'ghost':
          return "text-gray-400 hover:text-white hover:bg-white/5"
        case 'danger':
          return "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 hover:scale-105 active:scale-95"
        default:
          return "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-105 active:scale-95"
      }
    }

    const buttonClasses = cn(baseClasses, getVariantClasses())

    return (
      <motion.button
        ref={ref}
        className={buttonClasses}
        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        variants={motionVariants.scaleIn}
        initial="initial"
        whileHover="animate"
        whileTap="exit"
        disabled={disabled || loading}
        {...props}
      >
        {/* Shimmer effect for glass variant */}
        {variant === 'glass' && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.6 }}
          />
        )}
        
        {/* Loading spinner */}
        {loading && (
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
        )}
        
        {/* Icon */}
        {icon && iconPosition === 'left' && !loading && (
          <span className="mr-2">{icon}</span>
        )}
        
        {/* Content */}
        <span className="relative z-10">{children}</span>
        
        {/* Icon */}
        {icon && iconPosition === 'right' && !loading && (
          <span className="ml-2">{icon}</span>
        )}
      </motion.button>
    )
  }
)

Button.displayName = 'Button' 