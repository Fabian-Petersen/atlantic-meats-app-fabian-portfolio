// import { getCurrentPosition } from "@/utils/getCurrentPosition";
import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import {
  Html5QrcodeScanner,
  //   Html5Qrcode,
  type Html5QrcodeResult,
} from "html5-qrcode";
import { usePOST } from "@/utils/api";
import { getCurrentPosition } from "@/utils/getCurrentPosition";
import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";

export default function ScannerPage() {
  const [started, setStarted] = useState(false);
  const [barcode, setBarcode] = useState<string | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  const { mutateAsync: postVerify, isPending } = usePOST({
    id: barcode ?? "",
    resourcePath: "api/assets",
    action: "verify",
    queryKey: ["assets"],
  });

  const handleVerify = async () => {
    try {
      const position = await getCurrentPosition();
      const result = await postVerify({
        assetID: barcode,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      console.log(result);
      // alert({ assetID: barcode, position });
    } catch (err) {
      console.error("Verification failed:", err);
      alert("Verification failed. Please try again.");
      return;
    }

    // alert(`Scanned value: ${value}`);
  };

  useEffect(() => {
    // Only init scanner when started and #reader div exists
    if (!started) return;

    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 30, qrbox: { width: 250, height: 250 } },
      false,
    );

    function success(decodedText: string, decodedResult: Html5QrcodeResult) {
      console.log("Decoded Result:", decodedResult);
      scanner
        .clear()
        .then(() => {
          setBarcode(decodedText);
          handleVerify();
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

  if (isPending) return <PageLoadingSpinner />;

  return (
    <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center">
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
          className="absolute bottom-10 w-14 h-14 rounded-full outline-2 bg-black outline-black outline-offset-4 z-9999"
        />
      )}

      {/* Camera inactive placeholder */}
      {!started && <p className="text-white/50 text-sm">Camera inactive</p>}

      {/* 
        IMPORTANT: #reader must be a clean, empty div.
        html5-qrcode owns this DOM node entirely — never put children inside it.
      */}
      <div
        id="reader"
        className={`w-full h-full ${started ? "block" : "hidden"}`}
      />

      {/* Scanning overlay — rendered *outside* #reader, positioned over it */}
      {/* 
      {started && !barcode && (
        <>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center border border-dashed border-red-500">
            <div className="relative w-64 h-64">
              {/* Corner accents
              <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-white" />
              <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-white" />
              <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-white" />
              <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-white" />
              {/* Scan line
              <div className="absolute left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-red-400 to-transparent animate-scanLine" />
            </div>
          </div>
          <p className="absolute bottom-24 md:bottom-36 text-white/70 text-sm">
            Point camera at barcode
          </p>
        </>
      )} 
       */}

      {/* Result card */}
      {barcode && (
        <div className="absolute bottom-24 mx-4 p-4 rounded-lg border border-white/20 bg-white/10 text-white">
          <p className="text-sm text-white/60">Asset detected</p>
          <p className="text-lg font-medium">{barcode}</p>
        </div>
      )}
    </div>
  );
}
