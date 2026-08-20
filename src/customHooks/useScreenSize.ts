// $ create a hook that check for the screen width whn it is mobie and return a boolean value

import { useEffect, useState } from "react";

/**
 * useScreenSize
 *
 * Determines whether the current viewport width is at or below a given
 * breakpoint, and keeps that value in sync as the window is resized.
 *
 * @param width - The breakpoint in pixels. The hook returns `true` when
 * `window.innerWidth` is less than or equal to this value.
 *
 * @returns `true` if the viewport is at or below `width` (i.e. "mobile"),
 * otherwise `false`.
 *
 * @remarks
 * - Runs an initial check on mount so the correct value is set immediately.
 * - Attaches/cleans up a `resize` listener on `window`.
 * - Re-evaluates if `width` changes.
 * - SSR-safe (defaults to `false` until the effect runs client-side), but
 *   may cause a brief flash of desktop layout on first paint for mobile
 *   viewports since `window` isn't available during server rendering.
 *
 * @example
 * ```tsx
 * const isMobile = useScreenSize(768);
 * return isMobile ? <MobileNav /> : <DesktopNav />;
 * ```
 */
const useScreenSize = (width: number) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= width);
    };
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [width]);

  return isMobile;
};

export default useScreenSize;
