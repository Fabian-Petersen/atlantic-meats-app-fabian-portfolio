import { useContext } from "react";
import { ModalStateContext } from "./modal-context";

export const useModalState = () => {
  const context = useContext(ModalStateContext);

  if (!context) {
    throw new Error("useModalState must be used within the AppProvider");
  }

  return context;
};
