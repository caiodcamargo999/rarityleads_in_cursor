"use client";
import { forwardRef, ReactNode } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

export type ButtonProps = HTMLMotionProps<"button"> & {
  variant?: "primary" | "secondary" | "outline" | "danger";
  loading?: boolean;
  children?: ReactNode;
};

const baseStyles =
  "inline-flex items-center justify-center font-medium rounded-full px-8 py-4 text-lg transition-all duration-300 min-w-[160px] text-center group select-none disabled:opacity-50 disabled:cursor-not-allowed";

const variants: Record<string, string> = {
  primary:
    "bg-gradient-to-r from-[#6D28D9] via-[#8B5CF6] to-[#232336] text-white shadow-lg hover:from-[#8B5CF6] hover:to-[#6D28D9] border-none",
  secondary:
    "bg-button-bg text-button-text border border-border hover:bg-button-hover-bg",
  outline:
    "bg-transparent text-primary-text border border-[#8B5CF6] hover:bg-[#232336] hover:text-white",
  danger:
    "bg-red-700 text-white border border-red-800 hover:bg-red-800",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    children,
    className,
    variant = "primary",
    loading = false,
    disabled,
    ...props
  }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={clsx(baseStyles, variants[variant], className)}
        whileHover={{ scale: 1.06, boxShadow: "0 2px 16px 0 rgba(139, 92, 246, 0.12)" }}
        whileTap={{ scale: 0.97 }}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <span className="inline-block animate-spin mr-2 w-5 h-5 border-2 border-t-transparent border-white rounded-full"></span>
        ) : null}
        {children as ReactNode}
      </motion.button>
    );
  }
);
Button.displayName = "Button";

export default Button; 