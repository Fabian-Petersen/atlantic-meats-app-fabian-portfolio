import { useRef, useState, useCallback, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";

type ScannerStatus = "idle" | "starting" | "scanning" | "stopping";

const ELEMENT_ID = "reader";

// async function getBestBackCamera(): Promise<string | null> {
//   const devices = await Html5Qrcode.getCameras();

//   if (!devices.length) return null;

//   // Filter to back cameras
//   const backCameras = devices.filter((d) =>
//     /back|rear|environment/i.test(d.label),
//   );

//   const pool = backCameras.length ? backCameras : devices;

//   // Prefer "wide" or main lens — avoid "ultra wide" and "front"
//   const preferred = pool.find(
//     (d) => /wide/i.test(d.label) && !/ultra/i.test(d.label),
//   );

//   // Fallback: last in the list — most devices order cameras
//   // with the highest-res main camera last
//   return preferred?.id ?? pool[pool.length - 1].id;
// }

export function useBarcodeScanner() {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [status, setStatus] = useState<ScannerStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const start = useCallback(
    async (onScanSuccess: (decodedText: string) => void) => {
      if (status !== "idle") return;

      try {
        setStatus("starting");
        setError(null);

        // const cameraId = await getBestBackCamera();

        scannerRef.current = new Html5Qrcode(ELEMENT_ID, {
          verbose: false,
        });

        await scannerRef.current.start(
          { facingMode: "environment" },
          {
            fps: 30,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            onScanSuccess(decodedText);
          },
          undefined, // suppress per-frame errors
        );

        setStatus("scanning");
      } catch (err) {
        scannerRef.current = null;
        setStatus("idle");
        setError(err instanceof Error ? err.message : "Failed to start camera");
      }
    },
    [status],
  );

  const stop = useCallback(async () => {
    if (status !== "scanning" || !scannerRef.current) return;

    try {
      setStatus("stopping");
      await scannerRef.current.stop();
      scannerRef.current = null;
      setStatus("idle");
    } catch (err) {
      setStatus("scanning");
      setError(err instanceof Error ? err.message : "Failed to stop camera");
    }
  }, [status]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      scannerRef.current
        ?.stop()
        .catch(() => {})
        .finally(() => {
          scannerRef.current = null;
        });
    };
  }, []);

  return {
    start,
    stop,
    status,
    error,
    isScanning: status === "scanning",
    isBusy: status === "starting" || status === "stopping",
  };
}
