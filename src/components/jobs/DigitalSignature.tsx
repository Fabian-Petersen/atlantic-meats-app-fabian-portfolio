import React, { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

type DigitalSignatureProps = {
  onSave: (signature: string) => void;
  className?: string;
};

const DigitalSignature: React.FC<DigitalSignatureProps> = ({
  onSave,
  className,
}) => {
  const sigRef = useRef<SignatureCanvas | null>(null);

  const handleClear = () => {
    sigRef.current?.clear();
  };

  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleEnd = () => {
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    saveTimeout.current = setTimeout(() => {
      if (!sigRef.current || sigRef.current.isEmpty()) return;
      onSave(sigRef.current.toDataURL("image/png"));
    }, 1000); // save after 1s of inactivity
  };

  return (
    <div className={`w-full mt-4 ${className}`}>
      <p className="mb-2 text-xs ml-1 dark:text-(--clr-textDark)">
        Customer Signature
      </p>

      <div className="border border-gray-300 dark:border-gray-700/30 rounded-md outline-none bg-white dark:bg-(--bg-primary_dark)">
        <SignatureCanvas
          ref={sigRef}
          onEnd={handleEnd}
          penColor="black"
          canvasProps={{
            className:
              "w-full h-40 touch-none dark:text-(--clr-textDark) text-white",
          }}
        />
      </div>

      <div className="flex gap-3 mt-2">
        <button
          type="button"
          onClick={handleClear}
          className="px-3 py-1 text-sm hover:text-red-500 border rounded-sm border-gray-300 hover:cursor-pointer tracking-wide dark:text-(--clr-textDark)"
        >
          Clear
        </button>

        {/* <button
          type="button"
          onClick={handleSave}
          className="px-3 py-1 text-sm bg-black text-white rounded"
        >
          Save Signature
        </button> */}
      </div>
    </div>
  );
};

export default DigitalSignature;
