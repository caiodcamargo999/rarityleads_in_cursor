"use client"

import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cardVariants } from "@/lib/motionVariants"
import { cn } from "@/lib/utils"

export interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'glass' | 'gradient' | 'elevated'
  hover?: boolean
  children: React.ReactNode
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hover = true, children, ...props }, ref) => {
    const variantClasses = {
      default: "bg-card border border-border",
      glass: "glass-card",
      gradient: "bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20",
      elevated: "bg-card border border-border shadow-premium-lg"
    }

    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-xl p-6 transition-all duration-300",
          variantClasses[variant],
          className
        )}
        variants={hover ? cardVariants : undefined}
        initial={hover ? "initial" : undefined}
        animate={hover ? "animate" : undefined}
        whileHover={hover ? "hover" : undefined}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-4", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-display text-2xl font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
