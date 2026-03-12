import useGlobalContext from "@/context/useGlobalContext";
import { CheckCircle } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// $ Animation
import { motion, AnimatePresence } from "motion/react";
type Success = {
  title?: string;
  message?: string;
  redirectPath?: string;
};

export const Success = ({
  title = "Your request was successful!",
  message = "Your request was successfully",
  redirectPath,
}: Success) => {
  const { showSuccess, setShowSuccess } = useGlobalContext();
  const navigate = useNavigate();

  // $ Show the Success Component when the request was successful
  useEffect(() => {
    if (!showSuccess) return;

    const timer = setTimeout(() => {
      setShowSuccess(false);
      if (redirectPath) {
        navigate(redirectPath);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [showSuccess, redirectPath, navigate, setShowSuccess]);

  if (!showSuccess) return null;

  return (
    <AnimatePresence>
      {showSuccess && (
        <motion.div
          className="fixed z-1000 h-screen top-0 left-0 w-full flex items-center justify-center px-4 bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="flex flex-col items-center justify-center gap-10 w-full max-w-lg rounded-2xl h-100 dark:border-[rgba(55,65,81,0.5)] border border-gray-100 dark:bg-[#1d2739] bg-white py-10 px-8 text-center shadow-sm"
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
              <h1 className="mb-2 text-2xl tracking-wide font-semibold text-gray-700 dark:text-gray-200">
                {title}
              </h1>
              <p className="mb-6 text-md tracking-wide text-gray-600">
                {message}
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
