import { useMemo } from 'react';

/**
 * Hook for consistent animation variants and configurations
 */
const useAnimations = () => {
  const animations = useMemo(() => ({
    // Page transition variants
    pageVariants: {
      initial: {
        opacity: 0,
        y: 20
      },
      animate: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1]
        }
      },
      exit: {
        opacity: 0,
        y: -20,
        transition: {
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1]
        }
      }
    },

    // Grid container variants
    gridVariants: {
      animate: {
        transition: {
          staggerChildren: 0.1
        }
      }
    },

    // Tile animation variants
    tileVariants: {
      initial: { 
        opacity: 0, 
        scale: 0.8 
      },
      animate: {
        opacity: 1,
        scale: 1,
        transition: {
          duration: 0.4,
          ease: [0.34, 1.56, 0.64, 1]
        }
      },
      hover: {
        scale: 1.05,
        y: -4,
        transition: {
          duration: 0.2,
          ease: [0.4, 0, 0.2, 1]
        }
      },
      tap: {
        scale: 0.98,
        transition: {
          duration: 0.1
        }
      }
    },

    // Unlock animation for new sets
    unlockVariants: {
      initial: { 
        scale: 0.5, 
        opacity: 0,
        rotate: -180
      },
      animate: {
        scale: 1,
        opacity: 1,
        rotate: 0,
        transition: {
          duration: 0.6,
          ease: [0.34, 1.56, 0.64, 1]
        }
      }
    },

    // Success animation variants
    successVariants: {
      initial: { 
        scale: 0.5, 
        opacity: 0 
      },
      animate: {
        scale: [0.5, 1.2, 1],
        opacity: 1,
        transition: {
          duration: 0.6,
          times: [0, 0.6, 1],
          ease: [0.34, 1.56, 0.64, 1]
        }
      }
    },

    // Button animation variants
    buttonVariants: {
      hover: {
        scale: 1.02,
        y: -2,
        transition: {
          duration: 0.2,
          ease: [0.4, 0, 0.2, 1]
        }
      },
      tap: {
        scale: 0.98,
        transition: {
          duration: 0.1
        }
      }
    },

    // Input focus animation
    inputVariants: {
      focus: {
        scale: 1.02,
        transition: {
          duration: 0.2,
          ease: [0.4, 0, 0.2, 1]
        }
      }
    },

    // Loading spinner variants
    spinnerVariants: {
      animate: {
        rotate: 360,
        transition: {
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }
      }
    },

    // Pulse animation for unlocked tiles
    pulseVariants: {
      animate: {
        opacity: [0.8, 1, 0.8],
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    },

    // Golden glow animation for completion
    glowVariants: {
      animate: {
        boxShadow: [
          "0 0 20px rgba(255, 215, 0, 0.3)",
          "0 0 40px rgba(255, 215, 0, 0.6)",
          "0 0 20px rgba(255, 215, 0, 0.3)"
        ],
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    }
  }), []);

  // Animation configuration constants
  const config = useMemo(() => ({
    // Spring configuration for smooth animations
    spring: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
      mass: 1
    },

    // Easing curves
    easing: {
      smooth: [0.4, 0, 0.2, 1] as const,
      bounce: [0.34, 1.56, 0.64, 1] as const,
      sharp: [0.4, 0, 0.6, 1] as const
    },

    // Duration presets
    duration: {
      fast: 0.2,
      normal: 0.4,
      slow: 0.6
    }
  }), []);

  return {
    ...animations,
    config
  };
};

export default useAnimations;