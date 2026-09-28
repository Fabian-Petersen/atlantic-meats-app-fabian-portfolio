// $ No Custom Overlay
import { useCallback, useState, useEffect, useRef } from "react";
import {
  Camera,
  ChevronLeft,
  LoaderCircle,
  LocateFixed,
  ScanLine,
  ShieldCheck,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Html5QrcodeScanner, type Html5QrcodeResult } from "html5-qrcode";
import { usePOST } from "@/utils/api";
import { getCurrentPosition } from "@/utils/getCurrentPosition";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type VerifyAssetResponse = {
  message: string;
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;

  if (!axios.isAxiosError(error)) return "Unexpected error";

  const data = error.response?.data;

  // Lambda proxy envelope: body is a JSON string
  if (typeof data?.body === "string") {
    try {
      const parsed = JSON.parse(data.body);
      if (parsed?.message) return parsed.message;
    } catch {
      // fall through
    }
  }

  // Direct message on the data object
  if (data?.message) return data.message;

  return error.message || "Unknown error";
};

export default function ScannerPage() {
  const [started, setStarted] = useState(false);
  const [barcode, setBarcode] = useState<string | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  // Temporary mobile debug state
  // const [debug, setDebug] = useState<VerifyAssetResponse | null>(null);
  const navigate = useNavigate();

  const { mutateAsync: postVerify, isPending: isVerifying } = usePOST<
    unknown,
    VerifyAssetResponse
  >({
    id: barcode ?? "",
    resourcePath: "api/assets",
    action: "verify",
    queryKey: ["assets"],
  });

  const handleVerify = useCallback(
    async (value: string) => {
      setStarted(false);
      try {
        const position = await getCurrentPosition();

        const response = await postVerify({
          assetID: value,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        // setDebug(response);

        toast.success(response?.message, { duration: 1500 });
      } catch (error) {
        toast.error(getErrorMessage(error), { duration: 1500 });
      }
    },
    [postVerify],
  );

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
          navigate("/assets/verification");
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
  }, [started, handleVerify, navigate]); // runs when `started` flips to true

  if (isVerifying) {
    return (
      <div
        className="fixed inset-0 z-9999 flex min-h-100dvh flex-col items-center justify-center bg-slate-950 px-6 text-white"
        role="status"
        aria-live="polite"
      >
        <div className="relative mb-6 flex size-24 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-400/30">
          <ShieldCheck
            className="size-11 text-emerald-400"
            aria-hidden="true"
          />
          <LoaderCircle
            className="absolute inset-0 size-24 animate-spin text-emerald-400/70"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </div>
        <h1 className="text-xl font-semibold">Verifying asset</h1>
        <p className="mt-2 max-w-xs text-center text-sm leading-6 text-slate-300">
          Confirming the scanned barcode and verification location. Keep this
          screen open.
        </p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-9999 min-h-100dvh overflow-hidden bg-slate-950 text-white">
      {/* {debug && (
        <div className="text-xs bg-black text-white p-2 absolute w-full h-full">
          {JSON.stringify(debug, null, 2)}
        </div>
      )} */}
      {!started && (
        <div className="relative z-10 flex min-h-100dvh flex-col px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))]">
          <div
            className="pointer-events-none absolute inset-0 opacity-80"
            style={{
              background:
                "radial-gradient(circle at 50% 35%, rgba(16, 185, 129, 0.18), transparent 38%)",
            }}
            aria-hidden="true"
          />

          <header className="relative flex h-12 items-center justify-center">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="absolute left-0 flex min-h-11 items-center gap-1 rounded-full px-2 text-sm text-slate-200 transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
              aria-label="Go back"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
              Back
            </button>
            <p className="text-sm font-medium tracking-wide text-slate-200">
              Asset verification
            </p>
          </header>

          <main className="relative flex flex-1 flex-col items-center justify-center py-8 text-center">
            <div className="relative mb-8 flex size-32 items-center justify-center rounded-4xl border border-white/10 bg-white/5 shadow-2xl shadow-emerald-950/30 backdrop-blur-sm">
              <div className="absolute inset-3 rounded-3xl border border-dashed border-emerald-400/40" />
              <ScanLine
                className="size-16 text-emerald-400"
                aria-hidden="true"
              />
            </div>

            <h1 className="text-2xl font-semibold tracking-tight">
              Scan Asset Barcode
            </h1>
            <p className="mt-3 max-w-sm text-xs leading-6 text-slate-300">
              Hold the phone steady and place the full barcode inside the scan
              frame. Verification starts automatically after detection.
            </p>

            <div className="mt-8 grid w-full max-w-sm grid-cols-2 gap-3 text-left">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <Camera
                  className="mb-2 size-5 text-emerald-400"
                  aria-hidden="true"
                />
                <p className="text-xs font-medium">Camera access</p>
                <p className="mt-1 text-[11px] leading-4 text-slate-400">
                  Required to read the barcode
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <LocateFixed
                  className="mb-2 size-5 text-emerald-400"
                  aria-hidden="true"
                />
                <p className="text-xs font-medium">Location access</p>
                <p className="mt-1 text-[11px] leading-4 text-slate-400">
                  Recorded with verification
                </p>
              </div>
            </div>
          </main>

          <div className="relative mx-auto w-full max-w-sm">
            <button
              type="button"
              aria-label="Start scanning"
              onClick={() => setStarted(true)}
              className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 text-base font-semibold text-slate-950 shadow-lg shadow-emerald-950/30 transition-colors hover:bg-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 active:bg-emerald-600"
            >
              <ScanLine className="size-5" aria-hidden="true" />
              Start Scanning
            </button>
            <p className="mt-3 text-center text-[11px] leading-4 text-slate-500">
              Camera and location are used only for this verification.
            </p>
          </div>
        </div>
      )}

      {/*
        IMPORTANT: #reader must be a clean, empty div.
        html5-qrcode owns this DOM node entirely — never put children inside it.
      */}
      <div
        id="reader"
        className={started ? "fixed inset-0 z-0 h-screen w-screen" : "hidden"}
      />

      {started && (
        <>
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-20 h-36 bg-linear-to-b from-black/80 to-transparent"
            aria-hidden="true"
          />
          <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-4 pb-3 pt-[max(1rem,env(safe-area-inset-top))]">
            <div>
              <p className="text-sm font-semibold">Scan asset barcode</p>
              <p className="mt-0.5 text-xs text-white/70">
                Align the barcode inside the frame
              </p>
            </div>
            <button
              type="button"
              aria-label="Stop scanning"
              className="flex size-11 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              onClick={() => setStarted(false)}
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </header>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-linear-to-t from-black/90 via-black/50 to-transparent px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-24 text-center">
            <p className="text-sm font-medium">Scanning automatically</p>
            <p className="mt-1 text-xs text-white/70">
              Keep the barcode well lit and hold your phone steady.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
