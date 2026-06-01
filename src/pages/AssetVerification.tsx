import { useBarcodeScanner } from "../hooks/useBarcodeScanner";
import { usePOST } from "@/utils/api";
import { getCurrentPosition } from "@/utils/getCurrentPosition";
import BackButton from "@/components/features/BackButton";
import { sharedStyles } from "@/styles/shared";
import { cn } from "@/lib/utils";

export default function AssetVerification() {
  //   const navigate = useNavigate();
  const { videoRef, result, error: scanError } = useBarcodeScanner();

  const {
    mutate: verifyAsset,
    isPending,
    isSuccess,
    isError,
  } = usePOST({
    resourcePath: "api/assets",
    action: "action",
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
  };

  // $ Submit the data to the backend
  //   const onSubmit = async (data: CommentRequestFormValues) => {
  //     try {
  //       const payload: CommentPayload = { ...data, request_id: selectedRowId };
  //       await mutateAsync(payload);
  //       reset();
  //     } catch (error) {
  //       console.log("comment-error:", error);
  //     }
  //   };

  return (
    <div className={cn(sharedStyles.pageContainer)}>
      <div
        className={cn(sharedStyles.pageContent, "border border-red-500 h-full")}
      >
        <BackButton to={"/dashboard"} />
        <video ref={videoRef} className="w-full" />

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
