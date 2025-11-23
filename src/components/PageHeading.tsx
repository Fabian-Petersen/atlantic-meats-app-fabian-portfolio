"use client";

import * as React from "react";
import headingVariants from "@/app/animations/pageHeadingAnimate";
import { motion } from "framer-motion";
import ScrollAnimation from "@/app/animations/ScrollAnimation";

type PageHeadingProps = {
  title: string | undefined;
  variant?: "mainPage" | "projectPage";
  className?: string;
};

const PageHeading = ({
  title = "",
  variant,
  className = "",
}: PageHeadingProps & React.ComponentProps<typeof motion.h1>) => {
  // $ Animations
  const [parentContainerHeading, childContainerHeading, ContainerHeadingTwo] =
    headingVariants;

  // $ Select animation variant based on the `variant` prop
  const headingAnimation =
    variant === "projectPage" ? ContainerHeadingTwo : parentContainerHeading;

  return (
    <ScrollAnimation
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        y: { duration: 0.5 },
        opacity: { duration: 1.5, delay: 0.3 },
      }}
    >
      <motion.h1
        className={`${
          variant === "projectPage" ? className : ""
        } text-clampPageHeading mx-auto tracking-wide font-semibold dark:text-white text-blue-600 text-center pt-6`}
        initial={headingAnimation.initialState}
        animate={headingAnimation.animateState}
      >
        <motion.span
          className=" dark:bg-bgDark p-2"
          initial={childContainerHeading.initialState}
          animate={childContainerHeading.animateState}
        >
          {title}
        </motion.span>
      </motion.h1>
    </ScrollAnimation>
  );
};

export default PageHeading;
