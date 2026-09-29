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
  statusCode: number;
  message: string;
};

const unpackVerificationResponse = (
  response: unknown,
): VerifyAssetResponse | null => {
  if (!response || typeof response !== "object") return null;

  const data = response as Record<string, unknown>;
  const statusCode =
    typeof data.statusCode === "number" ? data.statusCode : 200;

  if (typeof data.message === "string") {
    return { statusCode, message: data.message };
  }

  if (typeof data.body !== "string") return null;

  try {
    const body = JSON.parse(data.body) as { message?: unknown };

    return typeof body.message === "string"
      ? { statusCode, message: body.message }
      : null;
  } catch {
    return null;
  }
};

const showVerificationError = (message: string) => {
  toast.error(message, {
    duration: 4500,
    classNames: {
      toast: "!border-red-200 !bg-red-50 dark:!border-red-800 dark:!bg-red-950",
      title: "!text-red-800 dark:!text-red-100",
      description: "!text-red-700 dark:!text-red-200",
      icon: "!text-red-600 dark:!text-red-300",
    },
  });
};

const showGenericVerificationError = () => {
  showVerificationError("Unable to verify asset. Please try again.");
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
    unknown
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

        const result = unpackVerificationResponse(response);

        if (!result) {
          console.error("Invalid asset verification response:", response);
          showGenericVerificationError();
          return;
        }

        if (result.statusCode >= 400) {
          if (result.statusCode === 404) {
            showVerificationError(result.message);
          } else {
            console.error("Asset verification failed:", result);
            showGenericVerificationError();
          }
          return;
        }

        toast.success(result.message, { duration: 1500 });
      } catch (error) {
        const isAxiosError = axios.isAxiosError(error);
        const result = isAxiosError
          ? unpackVerificationResponse(error.response?.data)
          : null;
        const httpStatus = isAxiosError ? error.response?.status : undefined;

        if (result?.statusCode === 404 || httpStatus === 404) {
          showVerificationError(
            result?.message ?? `Asset ${value} not registered in the database`,
          );
          return;
        }

        console.error("Asset verification failed:", error);
        showGenericVerificationError();
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
        className="fixed inset-0 z-9999 flex min-h-100dvh flex-col items-center justify-center bg-slate-50 px-6 text-slate-900 dark:bg-slate-950 dark:text-white"
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
        <h1 className="text-xl font-semibold">Verify Asset</h1>
        <p className="mt-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 font-mono text-sm font-medium text-emerald-700 dark:text-emerald-300">
          {barcode ?? "Scanned barcode"}
        </p>
        <p className="mt-2 max-w-xs text-center text-sm leading-6 text-slate-600 dark:text-slate-300">
          Confirming the scanned barcode and verification location. Keep this
          screen open.
        </p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-9999 min-h-100dvh overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      {/* {debug && (
        <div className="text-xs bg-black text-white p-2 absolute w-full h-full">
          {JSON.stringify(debug, null, 2)}
        </div>
      )} */}
      {!started && (
        <div className="relative z-10 flex min-h-100dvh flex-col px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))]">
          <div
            className="pointer-events-none absolute inset-0 opacity-80 dark:hidden"
            style={{
              background:
                "radial-gradient(circle at 50% 35%, rgba(16, 185, 129, 0.12), transparent 38%)",
            }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-0 hidden opacity-80 dark:block"
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
              className="absolute left-0 flex min-h-11 items-center gap-1 rounded-full px-2 text-sm text-slate-700 transition-colors hover:bg-slate-200/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 dark:text-slate-200 dark:hover:bg-white/10"
              aria-label="Go back"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
              Back
            </button>
            <p className="text-sm font-medium tracking-wide text-slate-700 dark:text-slate-200">
              Asset verification
            </p>
          </header>

          <main className="relative flex flex-1 flex-col items-center justify-center py-8 text-center">
            <div className="relative mb-8 flex size-32 items-center justify-center rounded-4xl border border-slate-200 bg-white shadow-2xl shadow-emerald-900/10 backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:shadow-emerald-950/30">
              <div className="absolute inset-3 rounded-3xl border border-dashed border-emerald-400/40" />
              <ScanLine
                className="size-16 text-emerald-400"
                aria-hidden="true"
              />
            </div>

            <h1 className="text-2xl font-semibold tracking-tight capitalize">
              Scan Asset Barcode
            </h1>
            <p className="mt-3 max-w-sm text-xs leading-6 text-slate-800 dark:text-slate-300">
              Hold the phone steady and place the full barcode inside the scan
              frame. Verification starts automatically after detection.
            </p>

            <div className="mt-8 grid w-full max-w-sm grid-cols-2 gap-3 text-left">
              <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none">
                <Camera
                  className="mb-2 size-5 text-emerald-400"
                  aria-hidden="true"
                />
                <p className="text-xs font-medium">Camera access</p>
                <p className="mt-1 text-[11px] leading-4 text-slate-500 dark:text-slate-400">
                  Required to read the barcode
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none">
                <LocateFixed
                  className="mb-2 size-5 text-emerald-400"
                  aria-hidden="true"
                />
                <p className="text-xs font-medium">Location access</p>
                <p className="mt-1 text-[11px] leading-4 text-slate-500 dark:text-slate-400">
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
        className={
          started
            ? "asset-verification-reader fixed inset-0 z-0 h-screen w-screen"
            : "hidden"
        }
      />

      {started && (
        <>
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-20 h-36 bg-linear-to-b from-black/50 to-transparent w-full"
            aria-hidden="true"
          />
          <header className="absolute inset-x-0 top-5 z-30 grid grid-cols-[2.75rem_minmax(0,1fr)_2.75rem] items-center gap-2 px-4 pb-3 pt-[max(1rem,env(safe-area-inset-top))]">
            <div aria-hidden="true" />

            <div className="min-w-0 text-center">
              <p className="text-sm font-semibold capitalize">
                Scan asset barcode
              </p>
              <p className="mt-0.5 text-xs text-blue-800">
                Align the barcode inside the frame
              </p>
            </div>

            <button
              type="button"
              aria-label="Stop scanning"
              className="flex size-11 shrink-0 items-center justify-center rounded-full border border-red-200 bg-red-100/90 text-red-600 shadow-sm backdrop-blur-sm transition-colors hover:bg-red-100 active:bg-red-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 dark:border-red-400/60 dark:bg-red-600 dark:text-white dark:shadow-lg dark:shadow-red-950/30 dark:hover:bg-red-500 dark:active:bg-red-700 dark:focus-visible:outline-red-300"
              onClick={() => setStarted(false)}
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </header>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-linear-to-t from-black/80 via-black/50 to-transparent px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-24 text-center">
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
