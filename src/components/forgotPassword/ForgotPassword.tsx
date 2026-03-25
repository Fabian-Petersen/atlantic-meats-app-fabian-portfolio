// $ React Hooks
import { useNavigate } from "react-router-dom";

// $ React-Hook-Form, zod schema
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// $ Hooks
import { useForgotPassword } from "@/utils/aws-forgotPassword";

// $ Import schemas
import {
  forgotPasswordSchema,
  type ForgotFormValues,
} from "../../schemas/index";

// $ Components
import FormHeading from "../../../customComponents/FormHeading";
import FormRowInput from "../../../customComponents/FormRowInput";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";
import { Spinner } from "../ui/spinner";

const ForgotPassword = () => {
  // $ Form Schema
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotFormValues>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(forgotPasswordSchema),
  });

  const navigate = useNavigate();
  const { sendResetCode } = useForgotPassword();

  const onSubmit = async (data: ForgotFormValues) => {
    const { email } = data;
    // console.log(data);
    const response = await sendResetCode(email);
    console.log(response);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-bgdark px-4">
      <div className="w-full max-w-md rounded-xl bg-white dark:bg-(--bg-primary_dark) p-8 shadow-md flex flex-col gap-8 border dark:border-border-dark/20 border-gray-100 min-h-[300px]">
        {/* Header */}
        <div className="flex flex-col gap-1.5">
          <button
            aria-label="Go back"
            type="button"
            className="flex items-center gap-1 text-sm text-gray-500 dark:text-(--clr-textDark) hover:text-(--clr-primary) transition-colors duration-150 w-fit hover:cursor-pointer"
            onClick={() => navigate("/")}
          >
            <ChevronLeft size={15} />
            Back
          </button>
          <FormHeading heading="Forgot Password" />
          <p className="text-left text-xs md:text-sm text-gray-500 dark:text-(--clr-textDark)">
            Enter your registered email.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 justify-between gap-4"
        >
          <FormRowInput
            label="Email"
            type="email"
            name="email"
            placeholder="Enter your email"
            register={register}
            error={errors.email}
          />

          <Button
            className={`
          w-full py-3 md:py-6 uppercase tracking-wider text-sm font-medium
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
            {isSubmitting ? <Spinner className="w-8 h-8 mx-auto" /> : "Submit"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
