import useGlobalContext from "@/context/useGlobalContext";
import type { RedirectResource } from "@/utils/api";
import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";
import { modalVariants } from "@/styles/motionStyles";

/**
 * Error Component
 *
 * A global, animated error modal used to display application-wide error feedback.
 * The component listens to error state from a global context and renders a
 * temporary modal with a title, message, and optional redirect behaviour.
 *
 * Features:
 * - Displays a centered modal with an error icon, title, and message
 * - Automatically dismisses after 1.5 seconds
 * - Optionally redirects to a specified route after dismissal
 * - Uses AnimatePresence and motion for smooth enter/exit animations
 *
 * Behaviour:
 * - Renders nothing when `showError` is false
 * - When `showError` is true:
 *   - Modal animates into view
 *   - A timeout is started (1500ms)
 *   - After timeout:
 *     - `setShowError(false)` is called
 *     - If `errorConfig.redirectPath` exists, navigates to `/${redirectPath}`
 *
 * Configuration:
 * - Controlled via `useGlobalContext`
 * - Accepts an optional `errorConfig`:
 *   {
 *     title?: string;
 *     message?: string;
 *     redirectPath?: RedirectResource | null;
 *   }
 *
 * - Falls back to default values if no config is provided:
 *   title: "Oops, something went wrong!!"
 *   message: "We couldn’t load the data. Please try again."
 *
 * Usage:
 * - Should be mounted once at a high level (e.g. root layout)
 * - Triggered by updating global state:
 *     setErrorConfig({ title, message, redirectPath })
 *     setShowError(true)
 *
 * Notes:
 * - Designed for short, high-level error feedback
 * - Not suitable for detailed or inline validation errors
 * - Ensure routes used in `redirectPath` align with router configuration
 */

export const Error = () => {
  const { showError, setShowError, errorConfig } = useGlobalContext();
  const navigate = useNavigate();

  const DEFAULT_ERROR_CONFIG = {
    title: "Oops, something went wrong!!",
    message: "We couldn’t load the data. Please try again.",
    redirectPath: null as RedirectResource | null,
  };

  const config = errorConfig ?? DEFAULT_ERROR_CONFIG;

  // $ Show the Success Component when the request was successful
  useEffect(() => {
    if (!showError) return;

    const timer = setTimeout(() => {
      setShowError(false);
      if (config.redirectPath) {
        navigate(`/${config.redirectPath}`);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [showError, config.redirectPath, navigate, setShowError]);

  if (!showError) return null;

  return (
    <AnimatePresence>
      {showError ? (
        <motion.div
          className={cn(sharedStyles.actionModalParent)}
          variants={modalVariants.parent}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <motion.div
            className={cn(sharedStyles.actionModalContent)}
            variants={modalVariants.content}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <motion.div
              variants={modalVariants.icon}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <AlertTriangle size={140} className="text-red-500" />
            </motion.div>

            <motion.div
              variants={modalVariants.text}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <h1 className={cn(sharedStyles.actionModalTitle)}>
                {config.title}
              </h1>
              <p className={cn(sharedStyles.actionModalMessage)}>
                {config.message}
              </p>
            </motion.div>
            <div className="flex gap-2"></div>
          </motion.div>
        </motion.div>
      ) : undefined}
    </AnimatePresence>
  );
};
