import type { Variants } from "motion/react";

/**
 * Styles to open and close a mobile card with a smooth transition.
 */
export const motionVariants = {
  expandable: {
    open: {
      height: "auto",
      opacity: 1,
      // marginTop: 12,
      transition: {
        height: {
          duration: 0.3,
          ease: "easeInOut",
        },
        opacity: {
          duration: 0.2,
          delay: 0.05,
        },
      },
    },

    closed: {
      height: 0,
      opacity: 0,
      marginTop: 0,
      transition: {
        height: {
          duration: 0.25,
          ease: "easeInOut",
        },
        opacity: {
          duration: 0.2,
          delay: 0.02,
        },
      },
    },
  } satisfies Variants,
};

export const modalVariants = {
  parent: {
    initial: {
      opacity: 0,
    },

    animate: {
      opacity: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },

    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  },

  content: {
    initial: {
      opacity: 0,
      scale: 0,
      y: 8,
    },

    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.25,
        ease: "easeOut",
      },
    },

    exit: {
      opacity: 0,
      scale: 0,
      y: 4,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  },

  icon: {
    initial: {
      opacity: 0,
      scale: 0.9,
    },

    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.1,
        duration: 0.25,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.15,
        ease: "easeIn",
      },
    },
  },

  text: {
    initial: {
      opacity: 0,
      y: 6,
    },

    animate: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.15,
        duration: 0.2,
      },
    },
    exit: {
      opacity: 0,
      y: 4,
      transition: {
        duration: 0.15,
        ease: "easeIn",
      },
    },
  },

  actions: {
    initial: {
      opacity: 0,
      y: 6,
    },

    animate: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2,
        duration: 0.2,
      },
    },
    exit: {
      opacity: 0,
      y: 4,
      transition: {
        duration: 0.15,
        ease: "easeIn",
      },
    },
  },
} satisfies Record<string, Variants>;
