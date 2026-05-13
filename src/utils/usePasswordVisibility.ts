import { useState } from "react";

/**
 * Hook to manage password visibility for one or more password fields independently.
 *
 * Each field is identified by a unique string key. Only one field can be visible
 * at a time — toggling a field hides any previously visible field.
 *
 * @returns {{
 *   isVisible: (field: string) => boolean,
 *   toggle: (field: string) => void,
 *   type: (field: string) => "text" | "password"
 * }}
 *
 * @example
 * // Basic usage with a single password field
 * const { isVisible, toggle, type } = usePasswordVisibility();
 *
 * <input
 *   type={type("password")}
 *   placeholder="Enter your password"
 * />
 * <button onClick={() => toggle("password")}>
 *   {isVisible("password") ? "Hide" : "Show"}
 * </button>
 *
 * @example
 * // Usage with multiple password fields (e.g. password + confirm password)
 * const { isVisible, toggle, type } = usePasswordVisibility();
 *
 * <FormRowInput
 *   label="Password"
 *   name="newPassword"
 *   type={type("newPassword")}
 *   togglePassword={() => toggle("newPassword")}
 *   isVisible={isVisible("newPassword")}
 * />
 * <FormRowInput
 *   label="Confirm Password"
 *   name="confirmPassword"
 *   type={type("confirmPassword")}
 *   togglePassword={() => toggle("confirmPassword")}
 *   isVisible={isVisible("confirmPassword")}
 * />
 */
export const usePasswordVisibility = () => {
  const [visibleField, setVisibleField] = useState<string | null>(null);

  const toggle = (field: string) => {
    setVisibleField((prev) => (prev === field ? null : field));
  };

  const isVisible = (field: string) => visibleField === field;
  const type = (field: string) => (isVisible(field) ? "text" : "password");

  return { isVisible, toggle, type };
};