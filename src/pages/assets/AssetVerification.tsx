// $ No Custom Overlay
import { useCallback, useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

import { Html5QrcodeScanner, type Html5QrcodeResult } from "html5-qrcode";
import { usePOST } from "@/utils/api";
import { getCurrentPosition } from "@/utils/getCurrentPosition";
import axios from "axios";
import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";
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

  if (isVerifying) return <PageLoadingSpinner />;

  return (
    <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-white/20 dark:bg-gray-900">
      {/* {debug && (
        <div className="text-xs bg-black text-white p-2 absolute w-full h-full">
          {JSON.stringify(debug, null, 2)}
        </div>
      )} */}
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
      {!started && (
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
