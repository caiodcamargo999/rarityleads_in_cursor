"use client"

import { motion, HTMLMotionProps } from 'framer-motion'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { buttonVariants, motionVariants } from '@/lib/design-system'

export interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'glass'
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

const flatVariants = {
  primary: "bg-rarity-purple text-white border border-rarity-purple shadow-sm hover:shadow-lg hover:bg-rarity-purple-dark hover:border-rarity-purple-dark transition-all duration-200 font-medium",
  secondary: "bg-rarity-dark-bg text-white border border-rarity-purple shadow-sm hover:shadow-lg hover:bg-rarity-border hover:border-rarity-purple transition-all duration-200 font-medium",
  ghost: "bg-rarity-dark-bg-2 text-white border border-rarity-border shadow-sm hover:shadow-lg hover:bg-rarity-dark-bg hover:border-rarity-purple transition-all duration-200 font-normal",
  danger: "bg-rarity-dark-bg text-rarity-danger border border-rarity-danger shadow-sm hover:bg-rarity-danger hover:text-white hover:border-rarity-danger transition-all duration-200 font-medium",
  outline: "bg-transparent text-white border border-rarity-purple shadow-sm hover:bg-rarity-purple hover:text-white hover:border-rarity-purple transition-all duration-200 font-medium"
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
      switch (variant) {
        case 'primary':
          return flatVariants.primary
        case 'secondary':
          return flatVariants.secondary
        case 'ghost':
          return flatVariants.ghost
        case 'danger':
          return flatVariants.danger
        case 'outline':
          return flatVariants.outline
        default:
          return flatVariants.primary
      }
    }

    const buttonClasses = cn(baseClasses, getVariantClasses())

    return (
      <motion.button
        ref={ref}
        className={buttonClasses}
        style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: variant === 'ghost' ? 400 : 500 }}
        disabled={disabled || loading}
        {...props}
      >
        {/* Shimmer effect for glass variant */}
        {/* Removed: No glass/gradient allowed by design system */}
        
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