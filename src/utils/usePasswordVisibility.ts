// utils/usePasswordVisibility.ts
import { useState } from "react";

export const usePasswordVisibility = () => {
  const [isVisible, setIsVisible] = useState(false);

  return {
    isVisible,
    toggle: () => {
      setIsVisible((v) => !v);
    },
    type: isVisible ? "text" : "password",
  };
};
