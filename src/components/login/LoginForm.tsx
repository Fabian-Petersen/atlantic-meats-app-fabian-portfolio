import { Button } from "@/components/ui/button";

// $ React-Hook-Form, zod & schema
import { loginSchema } from "../../schemas/index";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
// import { Mail } from "lucide-react";

import FormRowInput from "../../../customComponents/FormRowInput";

// Show and Hide the Password
import { usePasswordVisibility } from "@/utils/usePasswordVisibility";

// $ Import schemas
import type { LoginFormValues } from "../../schemas/index";
type Props = {
  onSubmit: (data: LoginFormValues) => void;
  loading: boolean;
};

const LoginForm = ({ onSubmit, loading }: Props) => {
  // $ Form Schema
  const {
    register,
    handleSubmit,
    // control,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // $ Manange the Password Visibility
  const showPassword = usePasswordVisibility();

  return (
    <form
      className="flex flex-col gap-2 h-full rounded-lg max-w-xl text-gray-700"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col flex-1 gap-1">
        <div className="flex flex-col gap-6">
          <FormRowInput
            label="Email"
            type="email"
            name="email"
            // control={control}
            placeholder="Enter your email"
            register={register}
            error={errors.email}
            // Icon={Mail}
          />
          <FormRowInput
            label="Password"
            type={showPassword.type} // comes from the usePasswordVisibility hook
            togglePassword={showPassword.toggle} // comes from the usePasswordVisibility hook
            isVisible={showPassword.isVisible} // comes from the usePasswordVisibility hook
            name="password"
            // control={control}
            placeholder="Enter your password"
            register={register}
            error={errors.password}
            // Icon={Lock}
          />
        </div>
        <div className="flex justify-end">
          <a
            href="/forgot-password"
            className="text-blue-400 hover:text-blue-500 text-xs mt-auto"
          >
            Forgot Password
          </a>
        </div>
      </div>
      <Button
        className={` ${
          loading ? "bg-yellow-400 text-black" : "bg-(--clr-primary) text-white"
        }   leading-2 hover:bg-(--clr-primary)/90 hover:cursor-pointer uppercase tracking-wider py-6`}
        type="submit"
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
};

export default LoginForm;
