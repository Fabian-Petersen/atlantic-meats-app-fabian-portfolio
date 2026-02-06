import React, { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

type DigitalSignatureProps = {
  onSave: (signature: string) => void;
};

const DigitalSignature: React.FC<DigitalSignatureProps> = ({ onSave }) => {
  const sigRef = useRef<SignatureCanvas | null>(null);

  const handleClear = () => {
    sigRef.current?.clear();
  };

  const handleSave = () => {
    if (!sigRef.current || sigRef.current.isEmpty()) return;
    const dataUrl = sigRef.current.toDataURL("image/png");
    onSave(dataUrl);
  };

  return (
    <div className="w-full">
      <p className="mb-2 text-sm">Customer Signature</p>

      <div className="border border-gray-300 rounded-md outline-none bg-white">
        <SignatureCanvas
          ref={sigRef}
          penColor="black"
          canvasProps={{
            className: "w-full h-40 touch-none",
          }}
        />
      </div>

      <div className="flex gap-3 mt-3">
        <button
          type="button"
          onClick={handleClear}
          className="px-3 py-1 text-sm border rounded"
        >
          Clear
        </button>

        <button
          type="button"
          onClick={handleSave}
          className="px-3 py-1 text-sm bg-black text-white rounded"
        >
          Save Signature
        </button>
      </div>
    </div>
  );
};

export default DigitalSignature;
