// $ No Custom Overlay
import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

import { Html5QrcodeScanner, type Html5QrcodeResult } from "html5-qrcode";
import { usePOST } from "@/utils/api";
import { getCurrentPosition } from "@/utils/getCurrentPosition";
// import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";

type VerifyAssetResponse = {
  message: string;
};

export default function ScannerPage() {
  const [started, setStarted] = useState(false);
  const [barcode, setBarcode] = useState<string | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  // Temporary mobile debug state
  const [debug, setDebug] = useState<VerifyAssetResponse | null>(null);

  const { mutateAsync: postVerify } = usePOST<unknown, VerifyAssetResponse>({
    id: barcode ?? "",
    resourcePath: "api/assets",
    action: "verify",
    queryKey: ["assets"],
  });

  // $ Handle error messages from the backend to display in the toast.
  // $ getErrorMessage to also handle plain Error objects thrown below
  const getErrorMessage = (error: unknown): string => {
    // Plain Error thrown from unwrapLambdaResponse
    if (error instanceof Error) return error.message;

    if (!axios.isAxiosError(error)) return "Unexpected error";

    const data = error.response?.data;

    if (data?.message) return data.message;

    if (data?.body) {
      try {
        return JSON.parse(data.body)?.message ?? "Asset not found";
      } catch {
        return "Asset not found";
      }
    }

    return error.message || "Unknown error";
  };

  type LambdaEnvelope = {
    statusCode?: number;
    body?: string;
  };

  type VerifyAssetRaw = VerifyAssetResponse & LambdaEnvelope;
  // Unwrap Lambda proxy envelope: { statusCode, body: '{"message":"..."}' }
  const unwrapLambdaResponse = (
    response: VerifyAssetRaw & LambdaEnvelope,
  ): VerifyAssetResponse => {
    // If Lambda leaked its envelope through (API GW proxy passthrough)
    if (response?.statusCode && response.statusCode >= 400) {
      const parsed =
        typeof response.body === "string"
          ? JSON.parse(response.body)
          : response.body;
      throw new Error(parsed?.message ?? `Error ${response.statusCode}`);
    }

    // If body is a nested JSON string (double-encoded)
    if (typeof response.body === "string") {
      return JSON.parse(response.body as string) as VerifyAssetResponse;
    }

    return response;
  };

  const handleVerify = async (value: string) => {
    try {
      const position = await getCurrentPosition();

      const raw = (await postVerify({
        assetID: value,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      })) as VerifyAssetRaw;
      const response = unwrapLambdaResponse(raw);
      setDebug(response);

      toast.success(response?.message, { duration: 1500 });
    } catch (error) {
      toast.error(getErrorMessage(error), { duration: 1500 });
      return;
    }
  };

  useEffect(() => {
    // Only init scanner when started and #reader div exists
    if (!started) return;

    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 20, qrbox: { width: 250, height: 250 } },
      false,
    );

    function success(decodedText: string, decodedResult: Html5QrcodeResult) {
      console.log("Decoded Result:", decodedResult);
      toast.info(`Asset ${decodedText} detected`, { duration: 1000 });
      scanner
        .clear()
        .then(() => {
          setBarcode(decodedText);
          handleVerify(decodedText);
        })
        .catch(console.error);
    }

    function error(err: string) {
      console.log("Error:", err);
    }

    scanner.render(success, error);
    scannerRef.current = scanner;

    // Cleanup when component unmounts or started changes
    return () => {
      scannerRef.current?.clear().catch(console.error);
    };
  }, [started]); // runs when `started` flips to true

  // if (isPending) return <PageLoadingSpinner />;

  return (
    <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-white/20 dark:bg-gray-900">
      {debug && (
        <div className="text-xs bg-black text-white p-2 absolute w-full h-full">
          {JSON.stringify(debug, null, 2)}
        </div>
      )}
      {/* Close button */}

      {started && (
        <button
          type="button"
          aria-label="Close"
          className="absolute top-8 right-10 text-gray-400 z-50 hover:bg-white/30 hover:rounded-full p-2"
          onClick={() => setStarted(false)}
        >
          <X size={24} />
        </button>
      )}

      {/* Start button */}
      {!started && !barcode && (
        <button
          type="button"
          aria-label="Start scanning"
          onClick={() => setStarted(true)}
          className="absolute bottom-10 w-14 h-14 rounded-full outline-2 text-white bg-black dark:bg-white outline-black dark:outline-white outline-offset-4 z-9999"
        >
          Scan
        </button>
      )}

      {/* Camera inactive placeholder */}
      {!started && (
        <p className="absolute text-gray-600 text-center text-sm capitalize dark:text-gray-300">
          Camera inactive
        </p>
      )}

      {/*
        IMPORTANT: #reader must be a clean, empty div.
        html5-qrcode owns this DOM node entirely — never put children inside it.
      */}
      <div
        id="reader"
        className={started ? "fixed inset-0 w-screen h-screen" : "hidden"}
      />
    </div>
  );
}

// $ Custom Overlay
// import { useCallback } from "react";
// import { X } from "lucide-react";
// import { toast } from "sonner";

// import { useBarcodeScanner } from "@/hooks/useBarcodeScanner";
// import { usePOST } from "@/utils/api";
// import { getCurrentPosition } from "@/utils/getCurrentPosition";
// import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";

// export default function ScannerPage() {
//   const { start, stop, status, error, isScanning, isBusy } =
//     useBarcodeScanner();

//   // barcode is no longer stored in state — usePOST id can be a ref or
//   // passed directly since we call postVerify immediately on scan
//   const { mutateAsync: postVerify, isPending } = usePOST({
//     id: "", // not needed for POST — keep your existing signature
//     resourcePath: "api/assets",
//     action: "verify",
//     queryKey: ["assets"],
//   });

//   const handleScan = useCallback(
//     async (decodedText: string) => {
//       // Stop the camera immediately so it doesn't keep firing
//       await stop();

//       try {
//         const position = await getCurrentPosition();
//         await postVerify({
//           assetID: decodedText,
//           latitude: position.coords.latitude,
//           longitude: position.coords.longitude,
//         });
//         toast.success(`Asset ${decodedText} verified`, { duration: 2000 });
//       } catch (err) {
//         console.error("Verification failed:", err);
//         toast.error(`Asset ${decodedText} verification failed`, {
//           duration: 2000,
//         });
//       }
//     },
//     [stop, postVerify],
//   );

//   if (isPending) return <PageLoadingSpinner />;

//   return (
//     <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-white/20 dark:bg-gray-900">
//       {/* Close / stop button */}
//       {isScanning && (
//         <button
//           type="button"
//           aria-label="Close"
//           onClick={stop}
//           disabled={isBusy}
//           className="absolute top-8 right-10 text-gray-400 z-50 hover:bg-white/30 hover:rounded-full p-2"
//         >
//           <X size={24} />
//         </button>
//       )}

//       {/* Covers #reader when camera is inactive */}
//       {!isScanning && status !== "starting" && (
//         <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/20 dark:bg-gray-900">
//           <p className="text-gray-600 text-sm capitalize dark:text-gray-300">
//             Camera inactive
//           </p>
//         </div>
//       )}

//       {/* Error message */}
//       {error && (
//         <p className="absolute top-20 text-red-400 text-sm text-center px-4">
//           {error}
//         </p>
//       )}

//       {/*
//         IMPORTANT: #reader must always be in the DOM.
//         Html5Qrcode writes a <video> directly into this node.
//         Hide with CSS — never conditionally render it.
//       */}
//       {/* // $ Scanner target */}
//       <div id="reader" className="absolute inset-0 w-screen h-screen" />

//       {/* // $ Your custom scanning overlay — positioned over #reader */}
//       {isScanning && (
//         <>
//           <div className="pointer-events-none h-full w-full absolute inset-0 z-10 flex items-center justify-center">
//             <div className="relative w-64 h-64">
//               {/* Corner accents*/}
//               <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-white" />
//               <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-white" />
//               <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-white" />
//               <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-white" />
//               {/* Scan line*/}
//               <div className="absolute left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-red-400 to-transparent animate-scanLine" />
//             </div>
//           </div>
//           <p className="absolute bottom-24 md:bottom-36 text-white/70 text-sm">
//             Point camera at barcode
//           </p>
//         </>
//       )}

//       {/* Start button */}
//       {status === "idle" && (
//         <button
//           type="button"
//           aria-label="Start scanning"
//           onClick={() => start(handleScan)}
//           className="absolute bottom-10 w-14 h-14 rounded-full outline-2 text-white bg-black dark:bg-white outline-black dark:outline-white outline-offset-4 z-9999"
//         >
//           Scan
//         </button>
//       )}

//       {/* Starting spinner feedback */}
//       {status === "starting" && (
//         <p className="absolute bottom-12 text-white/60 text-sm animate-pulse">
//           Starting camera...
//         </p>
//       )}
//     </div>
//   );
// }
