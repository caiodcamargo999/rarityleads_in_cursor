import { Variants } from 'framer-motion'

// Performance-optimized animation variants
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' }
  }
}

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' }
  }
}

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' }
  }
}

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.4, ease: 'easeOut' }
  }
}

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.4, ease: 'easeOut' }
  }
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.2, ease: 'easeOut' }
  }
}

// Stagger animations for lists
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' }
  }
}

// Button animations
export const buttonTap: Variants = {
  tap: { 
    scale: 0.98,
    transition: { duration: 0.1 }
  }
}

export const buttonHover: Variants = {
  hover: { 
    scale: 1.02,
    transition: { duration: 0.2 }
  }
}

// Card animations
export const cardHover: Variants = {
  hover: { 
    y: -4,
    transition: { duration: 0.2, ease: 'easeOut' }
  }
}

export const cardTap: Variants = {
  tap: { 
    scale: 0.98,
    transition: { duration: 0.1 }
  }
}

// Modal animations
export const modalBackdrop: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.2 }
  }
}

export const modalContent: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95,
    y: 20
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: { 
      duration: 0.3,
      ease: 'easeOut'
    }
  }
}

// Page transitions
export const pageTransition: Variants = {
  hidden: { 
    opacity: 0,
    x: 20
  },
  visible: { 
    opacity: 1,
    x: 0,
    transition: { 
      duration: 0.3,
      ease: 'easeOut'
    }
  },
  exit: { 
    opacity: 0,
    x: -20,
    transition: { 
      duration: 0.2,
      ease: 'easeIn'
    }
  }
}

// Loading animations
export const loadingPulse: Variants = {
  animate: {
    scale: [1, 1.1, 1],
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
}

export const loadingDots: Variants = {
  animate: (i: number) => ({
    scale: [1, 1.2, 1],
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1,
      repeat: Infinity,
      delay: i * 0.2,
      ease: 'easeInOut'
    }
  })
}

// Sidebar animations
export const sidebarSlide: Variants = {
  hidden: { x: '-100%' },
  visible: { 
    x: 0,
    transition: { 
      duration: 0.3,
      ease: 'easeOut'
    }
  }
}

// Dropdown animations
export const dropdownSlide: Variants = {
  hidden: { 
    opacity: 0,
    y: -10,
    scale: 0.95
  },
  visible: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.2,
      ease: 'easeOut'
    }
  }
}

// Progress bar animation
export const progressFill: Variants = {
  hidden: { width: 0 },
  visible: (width: number) => ({
    width: `${width}%`,
    transition: { 
      duration: 0.8,
      ease: 'easeOut'
    }
  })
}

// Utility function for staggered animations
export const createStaggerAnimation = (delay: number = 0.1) => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: delay,
        delayChildren: 0.1
      }
    }
  }
})

// Performance-optimized spring settings
export const springConfig = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
  mass: 0.8
}

// Quick animation presets
export const animations = {
  fadeIn,
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  staggerContainer,
  staggerItem,
  buttonTap,
  buttonHover,
  cardHover,
  cardTap,
  modalBackdrop,
  modalContent,
  pageTransition,
  loadingPulse,
  loadingDots,
  sidebarSlide,
  dropdownSlide,
  progressFill
} 