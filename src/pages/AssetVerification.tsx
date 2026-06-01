// import { getCurrentPosition } from "@/utils/getCurrentPosition";
import { useState } from "react";
// import { usePOST } from "@/utils/api";
// import BarcodeScannerComponent from "react-qr-barcode-scanner";
import BackButton from "@/components/features/BackButton";
import { sharedStyles } from "@/styles/shared";
import { cn } from "@/lib/utils";
import BarcodeScanner from "react-qr-barcode-scanner";

export default function ScannerPage() {
  const [started, setStarted] = useState(false);
  //   const [result, setResult] = useState<string | null>(null);
  const [barcode, setBarcode] = useState<string | null>(null);

  //   const {
  //     mutate: verifyAsset,
  //     isPending,
  //     isSuccess,
  //     isError,
  //   } = usePOST({
  //     resourcePath: "api/assets",
  //     action: "action",
  //     queryKey: ["assets"] as const,
  //   });

  //   const handleScan = async (data: string) => {
  //     const match = data.match(/[A-Z]{2}-\d{4}/);
  //     if (!match) return;

  //     // setResult(match[0]);
  //     setStarted(false); // stop scanner

  //     const { coords } = await getCurrentPosition();
  //     verifyAsset({
  //       assetId: match[0],
  //       latitude: coords.latitude,
  //       longitude: coords.longitude,
  //     });
  //     console.log("Submitting verification for", match[0], "at coords", coords);
  //   };

  return (
    <div className={cn(sharedStyles.pageContainer, "relative")}>
      {!started && !barcode && (
        <button
          type="button"
          aria-label="start scan button"
          onClick={() => setStarted(true)}
          className="bottom-10 absolute m-auto w-8 h-8 px-4 py-2 bg-white rounded-full outline-2 outline-rounded-full outline-offset-4 outline-white flex items-center justify-center"
        />
      )}

      <div className={cn(sharedStyles.pageContent, "h-full")}>
        <BackButton to="/dashboard" />
        {/* Scanner viewport */}
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
          {started && (
            <>
              <BarcodeScanner
                width={500}
                height={500}
                // facingMode="environment"
                onUpdate={(err, result) => {
                  if (err) {
                    console.error("Error scanning barcode:", err);
                  }
                  if (result) {
                    console.log("Barcode detected:", result.getText());
                    setBarcode(result.getText());
                  }
                  // const match = result.text.match(/[A-Z]{2}-\d{4}/);
                  // if (match) handleScan(match[0]);
                }}
                onError={(err) => console.error(err)}
              />
              {/* Scanning overlay */}

              <div className="absolute top-[1%] left-[1%] right-[1%] bottom-[1%] border border-white/30 border-dashed">
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-white rounded-tl" />
                <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-white rounded-tr" />
                <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-white rounded-bl" />
                <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-white rounded-br" />
                {/* Scanning line */}

                <div className="absolute left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-green-400 to-transparent animate-scanLine" />
              </div>
            </>
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

        {barcode && barcode !== null && barcode !== "Not Detected" && (
          <div className="mt-4 p-4 rounded-lg border">
            <p className="text-sm text-muted-foreground">Asset detected</p>
            <p className="text-lg font-medium">{barcode}</p>
            {/* {isPending && (
              <p className="text-sm mt-2">Submitting verification...</p>
            )}
            {isSuccess && (
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

// function getCurrentPosition(): Promise<GeolocationPosition> {
//   return new Promise((resolve, reject) =>
//     navigator.geolocation.getCurrentPosition(resolve, reject, {
//       enableHighAccuracy: true,
//       timeout: 8000,
//     }),
//   );
// }

// import { useBarcodeScanner } from "../hooks/useBarcodeScanner";
// import BackButton from "@/components/features/BackButton";
// import { sharedStyles } from "@/styles/shared";
// import { cn } from "@/lib/utils";

// export default function AssetVerification() {
//   const [started, setStarted] = useState(false);
//   const { videoRef, result, error: scanError } = useBarcodeScanner(started);

//   const {
//     mutate: verifyAsset,
//     isPending,
//     isSuccess,
//     isError,
//   } = usePOST({
//     resourcePath: "api/assets",
//     action: "verify",
//     queryKey: ["assets", "verify"] as const,
//   });

//   const handleVerify = async () => {
//     if (!result) return;
//     const { coords } = await getCurrentPosition();
//     verifyAsset({
//       assetID: result.assetID,
//       latitude: coords.latitude,
//       longitude: coords.longitude,
//     });
//     console.log(
//       "Submitting verification for",
//       result.assetID,
//       "at coords",
//       coords,
//     );
//   };

//   return (
//     <div className={cn(sharedStyles.pageContainer, "relative")}>
//       {/* Show start button until scanning begins */}
//       {!started && !result && (
//         <button
//           type="button"
//           aria-label="strat scan button"
//           onClick={() => setStarted(true)}
//           className=" bottom-10 absolute m-auto w-8 h-8 px-4 py-2 bg-white rounded-full outline-2 outline-rounded-full outline-offset-4 outline-white flex items-center justify-center"
//         />
//       )}
//       <div className={cn(sharedStyles.pageContent, "h-full border-dashed")}>
//         <BackButton to={"/dashboard"} />
//         <div className="relative w-full">
//           <video ref={videoRef} className="w-full block" />

//           {started && !result && (
//             <div className="absolute inset-0 pointer-events-none">
//               {/* Dimmed overlay outside scan area */}
//               <div className="absolute inset-0 bg-black/40" />

//               {/* Scan window */}
//               <div className="absolute top-[5%] left-[5%] right-[5%] bottom-[5%] border border-white/30 border-dashed">
//                 {/* Corner accents */}
//                 <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-white rounded-tl" />
//                 <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-white rounded-tr" />
//                 <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-white rounded-bl" />
//                 <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-white rounded-br" />

//                 {/* Scanning line */}
//                 <div className="absolute left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-green-400 to-transparent animate-scanLine" />
//               </div>
//             </div>
//           )}
//         </div>

//         {result && !isSuccess && (
//           <div>
//             <p>
//               Asset detected: <strong>{result.assetID}</strong>
//             </p>
//             <button type="button" onClick={handleVerify} disabled={isPending}>
//               {isPending ? "Submitting..." : "Confirm verification"}
//             </button>
//           </div>
//         )}

//         {isSuccess && <p>✓ Verification submitted successfully</p>}
//         {isError && <p>Failed to submit — please try again</p>}
//         {scanError && <p>{scanError.message ?? "An unknown error occurred"}</p>}
//       </div>
//     </div>
//   );
// }
