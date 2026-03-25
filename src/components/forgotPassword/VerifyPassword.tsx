// $ React Hooks
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

// $ React Hook Form + Zod
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type VerifyPinFormValues, verifyPinSchema } from "@/schemas";

// $ Components
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import FormHeading from "../../../customComponents/FormHeading";
import { ChevronLeft } from "lucide-react";
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

const VerifyPassword = ({ isLoading, onNext }: VerifyPasswordProps) => {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const navigate = useNavigate();

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
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
      if (onNext) console.log(onNext(data.pin));
      console.log(data.pin);
      setTimeout(() => {
        reset();
      }, 2000);
    } catch (error) {
      console.log(error);
    }
    //  onNext(data.pin);
  };

  const handleResendCode = () => {
    console.log("resend code");
  };

  return (
    <div className="flex min-h-screen dark:bg-bgdark items-center justify-center bg-gray-50 px-2">
      <div className="w-full max-w-md rounded-xl bg-white dark:bg-(--bg-primary_dark) p-8 shadow-md flex flex-col gap-6 border dark:border-border-dark/20 border-gray-100 min-h-[340px]">
        {/* Header */}
        <div className="flex flex-col gap-1.5">
          <FormHeading heading="Verify Code" />
          <p className="text-left text-xs md:text-sm text-gray-500 dark:text-(--clr-textDark)">
            Enter the 6-digit code sent to your email.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 gap-6"
        >
          {/* PIN inputs — centred horizontally */}
          <div className="flex flex-col items-center gap-3 flex-1 justify-center py-2">
            <div className="flex justify-center gap-2 sm:gap-2.5 w-full">
              {Array.from({ length: 6 }).map((_, index) => (
                <input
                  aria-label={`Digit ${index + 1}`}
                  key={index}
                  ref={(el) => {
                    inputsRef.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={pinValue[index] || ""}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleBackspace(index, e)}
                  className={`
                  h-12 w-full max-w-[52px] sm:h-14 sm:max-w-14
                  rounded-lg border text-center text-lg font-medium outline-none
                  transition-colors duration-150
                  dark:text-gray-100 dark:bg-transparent
                  ${
                    errors.pin
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-(--clr-primary) dark:border-gray-600"
                  }
                `}
                />
              ))}
            </div>
            <div className="flex justify-between w-full">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="flex items-center gap-1 text-xs lg:text-sm text-gray-500 dark:text-(--clr-textDark) hover:text-(--clr-primary) transition-colors duration-150 w-fit"
              >
                <span>
                  <ChevronLeft size={12} />
                </span>
                Return
              </button>
              <button
                className="hover:cursor-pointer text-blue-500 text-xs lg:text-sm py-2"
                type="button"
                onClick={handleResendCode}
              >
                Resend Code
              </button>
            </div>

            {errors.pin && (
              <p className="text-sm text-red-500 text-center">
                {errors.pin.message}
              </p>
            )}
          </div>

          {/* Button pinned to bottom */}
          <Button
            className={`
            w-full py-6 uppercase tracking-wider text-sm lg:text-md font-medium
            transition-colors duration-150 hover:cursor-pointer
            ${
              isSubmitting
                ? "bg-yellow-400 text-black"
                : "bg-(--clr-primary) hover:bg-(--clr-primary)/90 text-white"
            }
          `}
            type="submit"
            disabled={isSubmitting}
          >
            {isLoading ? (
              <span className="flex gap-2 items-center justify-center">
                <Spinner className="w-8 h-8" /> <p>Verifying...</p>
              </span>
            ) : (
              "Verify Code"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default VerifyPassword;
