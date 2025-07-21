"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion, HTMLMotionProps } from "framer-motion"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonTap, buttonHover } from "@/lib/motion"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rarity-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-rarity-600 text-white hover:bg-rarity-700 active:bg-rarity-800 shadow-sm",
        secondary: "bg-dark-bg-tertiary text-dark-text border border-dark-border hover:bg-dark-bg-secondary hover:border-dark-border-secondary",
        outline: "border border-dark-border bg-transparent text-dark-text hover:bg-dark-bg-tertiary hover:border-dark-border-secondary",
        ghost: "text-dark-text hover:bg-dark-bg-tertiary",
        danger: "bg-error-600 text-white hover:bg-error-700 active:bg-error-800",
        success: "bg-success-600 text-white hover:bg-success-700 active:bg-success-800",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'children'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  fullWidth?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  'aria-label'?: string
  children: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    loading = false,
    fullWidth = false,
    icon,
    iconPosition = 'left',
    disabled,
    children,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : motion.button
    
    const buttonClasses = cn(
      buttonVariants({ variant, size, className }),
      fullWidth && "w-full",
      loading && "cursor-not-allowed"
    )

    if (asChild) {
      return (
        <Slot
          ref={ref}
          className={buttonClasses}
          aria-busy={loading ? 'true' : undefined}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {icon && iconPosition === 'left' && !loading && (
            <span className="mr-2">{icon}</span>
          )}
          <span className="relative z-10">{children}</span>
          {icon && iconPosition === 'right' && !loading && (
            <span className="ml-2">{icon}</span>
          )}
        </Slot>
      )
    }

    return (
      <motion.button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || loading}
        aria-busy={loading ? 'true' : undefined}
        variants={{ ...buttonTap, ...buttonHover }}
        whileTap="tap"
        whileHover="hover"
        layout
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {icon && iconPosition === 'left' && !loading && (
          <span className="mr-2">{icon}</span>
        )}
        <span className="relative z-10">{children}</span>
        {icon && iconPosition === 'right' && !loading && (
          <span className="ml-2">{icon}</span>
        )}
      </motion.button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants } 