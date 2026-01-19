import { useRef } from "react";
import FormHeading from "../../../customComponents/FormHeading";
import { Button } from "../ui/button";

// React Hook Form + Zod
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type VerifyPinFormValues, verifyPinSchema } from "@/schemas";

/* -------------------------------------------------------------------------- */
/*                                   Props                                    */
/* -------------------------------------------------------------------------- */

type VerifyPasswordProps = {
  onNext?: (pin: string) => void;
  isLoading?: boolean;
};

/* -------------------------------------------------------------------------- */
/*                                Component                                   */
/* -------------------------------------------------------------------------- */

const VerifyPassword = ({ isLoading }: VerifyPasswordProps) => {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VerifyPinFormValues>({
    defaultValues: { pin: "" },
    resolver: zodResolver(verifyPinSchema),
  });

  const pinValue = watch("pin");

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const pinArray = pinValue.split("");
    pinArray[index] = value;
    const newPin = pinArray.join("").slice(0, 6);

    setValue("pin", newPin);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !pinValue[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const onSubmit = async (data: VerifyPinFormValues) => {
    try {
      console.log(data.pin);
    } catch (error) {
      console.log(error);
    }
    //  onNext(data.pin);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-4 shadow flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <FormHeading heading="Verify Code" />
          <p className="text-left text-sm text-gray-600">
            Enter the 6-digit code sent to your email.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* PIN Inputs */}
          <div className="flex justify-between gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <input
                aria-label="pin input"
                key={index}
                // ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={pinValue[index] || ""}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleBackspace(index, e)}
                className={`h-14 w-full rounded-md border text-center text-lg outline-none transition
                  ${
                    errors.pin
                      ? "border-red-500"
                      : "border-gray-300 focus:border-(--clr-primary)"
                  }`}
              />
            ))}
          </div>

          {errors.pin && (
            <p className="text-sm text-red-500">{errors.pin.message}</p>
          )}

          <Button
            className={`${
              isLoading
                ? "bg-yellow-400 text-black"
                : "bg-(--clr-primary) text-white"
            } w-full hover:bg-(--clr-primary)/90 uppercase tracking-wider py-6 hover:cursor-pointer`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify Code"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default VerifyPassword;
