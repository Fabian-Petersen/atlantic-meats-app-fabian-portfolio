import { useBarcodeScanner } from "../hooks/useBarcodeScanner";
import { usePOST } from "@/utils/api";
import { getCurrentPosition } from "@/utils/getCurrentPosition";
import BackButton from "@/components/features/BackButton";
import { sharedStyles } from "@/styles/shared";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function AssetVerification() {
  const [started, setStarted] = useState(false);
  const { videoRef, result, error: scanError } = useBarcodeScanner(started);

  const {
    mutate: verifyAsset,
    isPending,
    isSuccess,
    isError,
  } = usePOST({
    resourcePath: "api/assets",
    action: "verify",
    queryKey: ["assets", "verify"] as const,
  });

  const handleVerify = async () => {
    if (!result) return;
    const { coords } = await getCurrentPosition();
    verifyAsset({
      assetID: result.assetID,
      latitude: coords.latitude,
      longitude: coords.longitude,
    });
    console.log(
      "Submitting verification for",
      result.assetID,
      "at coords",
      coords,
    );
  };

  return (
    <div className={cn(sharedStyles.pageContainer, "relative")}>
      {/* Show start button until scanning begins */}
      {!started && !result && (
        <button
          type="button"
          aria-label="strat scan button"
          onClick={() => setStarted(true)}
          className=" bottom-10 absolute m-auto w-8 h-8 px-4 py-2 bg-white rounded-full outline-2 outline-rounded-full outline-offset-4 outline-white flex items-center justify-center"
        />
      )}
      <div className={cn(sharedStyles.pageContent, "h-full border-dashed")}>
        <BackButton to={"/dashboard"} />
        <div className="relative w-full">
          <video ref={videoRef} className="w-full block" />

          {started && !result && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Dimmed overlay outside scan area */}
              <div className="absolute inset-0 bg-black/40" />

              {/* Scan window */}
              <div className="absolute top-[5%] left-[5%] right-[5%] bottom-[5%] border border-white/30 border-dashed">
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-white rounded-tl" />
                <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-white rounded-tr" />
                <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-white rounded-bl" />
                <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-white rounded-br" />

                {/* Scanning line */}
                <div className="absolute left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-green-400 to-transparent animate-scanLine" />
              </div>
            </div>
          )}
        </div>

        {result && !isSuccess && (
          <div>
            <p>
              Asset detected: <strong>{result.assetID}</strong>
            </p>
            <button type="button" onClick={handleVerify} disabled={isPending}>
              {isPending ? "Submitting..." : "Confirm verification"}
            </button>
          </div>
        )}

        {isSuccess && <p>✓ Verification submitted successfully</p>}
        {isError && <p>Failed to submit — please try again</p>}
        {scanError && <p>{scanError.message ?? "An unknown error occurred"}</p>}
      </div>
    </div>
  );
}
