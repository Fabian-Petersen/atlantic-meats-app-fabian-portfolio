import FormRowInput from "../../../customComponents/FormRowInput";

// $ React-Hook-Form, zod & schema
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useForgotPassword } from "@/utils/aws-forgotPassword";

// $ Import schemas
import {
  forgotPasswordSchema,
  type ForgotFormValues,
} from "../../schemas/index";
import FormHeading from "../../../customComponents/FormHeading";
import { Button } from "../ui/button";

const ForgotPassword = () => {
  // $ Form Schema
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormValues>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(forgotPasswordSchema),
  });

  const { isLoading, sendResetCode } = useForgotPassword();

  const onSubmit = async (data: ForgotFormValues) => {
    const { email } = data;
    console.log(data);
    const response = await sendResetCode(email);
    console.log(response);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-4 shadow flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <FormHeading heading="Forgot Password" />
          <p className="mb-6 text-left text-sm text-gray-600">
            Enter your email for a reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <FormRowInput
            label="Email"
            type="email"
            name="email"
            placeholder="Enter your email"
            register={register}
            error={errors.email}
          />
          <Button
            className={` ${
              isLoading
                ? "bg-yellow-400 text-black"
                : "bg-(--clr-primary) text-white"
            }   w-full leading-2 hover:bg-(--clr-primary)/90 hover:cursor-pointer uppercase tracking-wider py-6`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Reset Password"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
