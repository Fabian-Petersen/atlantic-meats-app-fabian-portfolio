import { useEffect, useRef, useState, useCallback } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { NotFoundException } from "@zxing/library";

interface ScanResult {
  assetID: string;
  raw: string;
}

export function useBarcodeScanner(started: boolean) {
  // ← accepts started flag
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const stop = useCallback(() => {
    controlsRef.current?.stop();
    controlsRef.current = null;
  }, []);

  useEffect(() => {
    if (!started || !videoRef.current) return; // ← only start when triggered

    const reader = new BrowserMultiFormatReader();

    reader
      .decodeFromVideoDevice(undefined, videoRef.current, (res, err) => {
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
      })
      .then((controls) => {
        controlsRef.current = controls;
      });

    return () => {
      stop();
    };
  }, [started, stop]); // ← re-runs when started changes

  return { videoRef, result, error, stop };
}
