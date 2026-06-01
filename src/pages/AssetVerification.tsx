// import { getCurrentPosition } from "@/utils/getCurrentPosition";
import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Html5QrcodeScanner, type Html5QrcodeResult } from "html5-qrcode";

export default function ScannerPage() {
  const [started, setStarted] = useState(false);
  const [barcode, setBarcode] = useState<string | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  const handleScannedValue = (value: string) => {
    setBarcode(value);
    alert(`Scanned value: ${value}`);
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
      scanner
        .clear()
        .then(() => {
          handleScannedValue(decodedText);
        })
        .catch(console.error);
    }

    function error(err: string) {
      // noisy, safe to ignore
      console.log("Error:", err);
    }

    scanner.render(success, error);
    scannerRef.current = scanner;

    // Cleanup when component unmounts or started changes
    return () => {
      scannerRef.current?.clear().catch(console.error);
    };
  }, [started]); // runs when `started` flips to true

  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 bg-black z-9999 flex items-center justify-center">
      {/* Start Scanning Button */}
      {!started && !barcode && (
        <button
          type="button"
          aria-label="start scan button"
          onClick={() => setStarted(true)}
          className="bottom-10 absolute m-auto w-8 h-8 px-4 py-2 bg-white rounded-full outline-2 outline-rounded-full z-9999 outline-offset-4 outline-white flex items-center justify-center"
        />
      )}

      <div className="h-full">
        {/* CloseButton */}
        <button
          type="button"
          aria-label="Close Button"
          className="absolute top-8 right-10 text-gray-400 text-2xl z-50 hover:cursor-pointer hover:bg-white/30 hover:rounded-full p-2"
          onClick={() => navigate("/dashboard")}
        >
          <X size={24} />
        </button>

        {/* Scanner viewport */}
        <div className="absolute inset-0 overflow-hidden w-full aspect-video bg-black rounded-lg flex items-center justify-center">
          {started && (
            <div id="reader" className="w-full h-full relative">
              {/* Scanning overlay */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2">
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-white" />
                <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-white" />
                <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-white" />
                <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-white" />
                {/* Scanning line */}

                <div className="absolute left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-red-400 to-transparent animate-scanLine" />
              </div>
            </div>
          )}
          {!started && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-white/50 text-sm">Camera inactive</p>
            </div>
          )}
        </div>

        {/* Controls */}
        {started && !barcode && (
          <p className="text-center text-sm text-muted-foreground mt-3">
            Point camera at barcode
          </p>
        )}

        {barcode && barcode !== null && barcode !== "not detected" && (
          <div className="mt-4 p-4 rounded-lg border">
            <p className="text-sm text-muted-foreground">Asset detected</p>
            <p className="text-lg font-medium">{barcode}</p>
            {/* {isPending && (
              <p className="text-sm mt-2">Submitting verification...</p>
            )}
            {isSuccess && (P
              <p className="text-sm mt-2 text-green-600">
                ✓ Verified successfully
              </p>
            )}
            {isError && (
              <p className="text-sm mt-2 text-red-500">
                Failed to submit — please try again
              </p>
            )} */}
          </div>
        )}
      </div>
    </div>
  );
}
