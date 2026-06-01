import { useEffect, useRef, useState, useCallback } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { NotFoundException } from "@zxing/library";

interface ScanResult {
  assetID: string;
  raw: string;
}

export function useBarcodeScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const stop = useCallback(() => {
    controlsRef.current?.stop();
    controlsRef.current = null;
  }, []);

  useEffect(() => {
    if (!videoRef.current) return; // ← removed the `active` check

    const reader = new BrowserMultiFormatReader();

    reader
      .decodeFromConstraints(
        { video: { facingMode: "environment" } },
        videoRef.current,
        (res, err) => {
          if (res) {
            const text = res.getText();
            const match = text.match(/[A-Z]{2}-\d{4}/);
            if (match) {
              setResult({ assetID: match[0], raw: text });
              stop();
            }
          }
          if (err && !(err instanceof NotFoundException)) {
            setError(err);
          }
        },
      )
      .then((controls) => {
        controlsRef.current = controls;
      });

    return () => {
      stop(); // ← cleanup on unmount stops the camera
    };
  }, []); // ← empty deps, runs once on mount

  return { videoRef, result, error, stop };
}
