import useGlobalContext from "@/context/useGlobalContext";
import { CheckCircle } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// $ Animation
import { motion, AnimatePresence } from "motion/react";
import type { RedirectResource } from "@/utils/api";
import { sharedStyles } from "@/styles/shared";
import { cn } from "@/lib/utils";

export const Success = () => {
  const { showSuccess, setShowSuccess, successConfig } = useGlobalContext();
  const navigate = useNavigate();

  const DEFAULT_SUCCESS_CONFIG = {
    title: "Success",
    message: "Your request was completed successfully.",
    redirectPath: null as RedirectResource | null,
  };

  const config = successConfig ?? DEFAULT_SUCCESS_CONFIG;

  // $ Show the Success Component when the request was successful
  useEffect(() => {
    if (!showSuccess) return;

    const timer = setTimeout(() => {
      setShowSuccess(false);
      if (config.redirectPath) {
        navigate(`/${config.redirectPath}`);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [showSuccess, config.redirectPath, navigate, setShowSuccess]);

  if (!showSuccess) return null;

  return (
    <AnimatePresence>
      {showSuccess && (
        <motion.div
          className={cn(sharedStyles.actionModalParent)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className={cn(sharedStyles.actionModalContent)}
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 4 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.25, ease: "easeOut" }}
            >
              <CheckCircle size={140} className="text-check" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.2 }}
            >
              <h1 className={cn(sharedStyles.actionModalTitle)}>
                {config.title}
              </h1>
              <p className={cn(sharedStyles.actionModalMessage)}>
                {config.message}
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
