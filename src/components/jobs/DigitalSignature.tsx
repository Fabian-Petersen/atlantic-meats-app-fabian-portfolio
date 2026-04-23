import React, { useRef, useEffect, useState, useCallback } from "react";
import SignatureCanvas from "react-signature-canvas";

type DigitalSignatureProps = {
  onSave: (signature: string) => void;
  className?: string;
};

const DigitalSignature: React.FC<DigitalSignatureProps> = ({
  onSave,
  className,
}) => {
  const sigRef = useRef<SignatureCanvas | null>(null);
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);
  const snapshotRef = useRef<string | null>(null); // stores last valid signature data
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDark, setIsDark] = useState(false);

  // Detect dark mode from the DOM
  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const penColor = isDark ? "white" : "black";

  // Restore snapshot onto the canvas after resize/re-render
  const restoreSnapshot = useCallback(() => {
    if (!snapshotRef.current || !sigRef.current) return;

    const canvas = sigRef.current.getCanvas();
    const img = new Image();
    img.src = snapshotRef.current;
    img.onload = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  }, []);

  // On resize (e.g. mobile keyboard appearing), restore the signature
  useEffect(() => {
    const handleResize = () => {
      // Let the canvas re-render first, then restore
      requestAnimationFrame(() => {
        restoreSnapshot();
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [restoreSnapshot]);

  // On scroll (mobile viewport shifts), restore the signature
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        requestAnimationFrame(() => {
          restoreSnapshot();
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [restoreSnapshot]);

  const handleClear = () => {
    sigRef.current?.clear();
    snapshotRef.current = null;
    onSave(""); // notify parent that signature was cleared
  };

  const handleEnd = () => {
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    saveTimeout.current = setTimeout(() => {
      if (!sigRef.current || sigRef.current.isEmpty()) return;
      const dataUrl = sigRef.current.toDataURL("image/png");
      snapshotRef.current = dataUrl; // persist snapshot in memory
      onSave(dataUrl);
    }, 1000);
  };

  return (
    <div className={`w-full mt-4 ${className}`} ref={containerRef}>
      <p className="mb-2 text-xs ml-1 dark:text-(--clr-textDark)">
        Customer Signature
      </p>

      <div className="border border-gray-300 dark:border-gray-700/30 rounded-md outline-none bg-white dark:bg-(--bg-primary_dark)">
        <SignatureCanvas
          ref={sigRef}
          onEnd={handleEnd}
          penColor={penColor}
          canvasProps={{
            className: "w-full h-40 touch-none",
          }}
        />
      </div>

      <div className="flex gap-3 mt-2">
        <button
          type="button"
          onClick={handleClear}
          className="px-3 py-1 text-sm hover:text-red-500 border rounded-sm border-gray-300 hover:cursor-pointer tracking-wide dark:text-(--clr-textDark)"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default DigitalSignature;

/* -------------------------------------------------------------------------- */
/*                                Old Component                               */
/* -------------------------------------------------------------------------- */

// import React, { useRef } from "react";
// import SignatureCanvas from "react-signature-canvas";

// type DigitalSignatureProps = {
//   onSave: (signature: string) => void;
//   className?: string;
// };

// const DigitalSignature: React.FC<DigitalSignatureProps> = ({
//   onSave,
//   className,
// }) => {
//   const sigRef = useRef<SignatureCanvas | null>(null);

//   const handleClear = () => {
//     sigRef.current?.clear();
//   };

//   const saveTimeout = useRef<NodeJS.Timeout | null>(null);

//   const handleEnd = () => {
//     if (saveTimeout.current) {
//       clearTimeout(saveTimeout.current);
//     }

//     saveTimeout.current = setTimeout(() => {
//       if (!sigRef.current || sigRef.current.isEmpty()) return;
//       onSave(sigRef.current.toDataURL("image/png"));
//     }, 1000); // save after 1s of inactivity
//   };

//   return (
//     <div className={`w-full mt-4 ${className}`}>
//       <p className="mb-2 text-xs ml-1 dark:text-(--clr-textDark)">
//         Customer Signature
//       </p>

//       <div className="border border-gray-300 dark:border-gray-700/30 rounded-md outline-none bg-white dark:bg-(--bg-primary_dark)">
//         <SignatureCanvas
//           ref={sigRef}
//           onEnd={handleEnd}
//           penColor="black"
//           canvasProps={{
//             className:
//               "w-full h-40 touch-none dark:text-(--clr-textDark) text-white",
//           }}
//         />
//       </div>

//       <div className="flex gap-3 mt-2">
//         <button
//           type="button"
//           onClick={handleClear}
//           className="px-3 py-1 text-sm hover:text-red-500 border rounded-sm border-gray-300 hover:cursor-pointer tracking-wide dark:text-(--clr-textDark)"
//         >
//           Clear
//         </button>
//       </div>
//     </div>
//   );
// };

// export default DigitalSignature;
