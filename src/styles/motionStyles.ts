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
