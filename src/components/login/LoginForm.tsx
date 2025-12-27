import { Button } from "@/components/ui/button";
// import { PasswordToggleInput } from "@/components/PasswordToggleInput";

// $ React-Hook-Form, zod & schema
import { LoginSchema } from "../../schemas/index";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import FormRowInput from "../customComponents/FormRowInput";

// $ Import schemas
import type { LoginFormValues } from "../../schemas/index";

// const { userAttributes, setUserAttributes } = useGlobalContext();

const LoginForm = ({
  onSubmit,
  loading,
}: {
  onSubmit: (data: LoginFormValues) => void;
  loading: boolean;
}) => {
  // $ Form Schema
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
  });

  return (
    <form
      className="flex flex-col gap-8 rounded-lg max-w-xl text-gray-700"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col mt-auto gap-8">
        <FormRowInput
          label="Email"
          type="email"
          name="email"
          control={control}
          placeholder="Enter your email"
          register={register}
          error={errors.email}
        />
        <FormRowInput
          label="Password"
          type="password"
          name="password"
          control={control}
          placeholder="Enter your password"
          register={register}
          error={errors.password}
        />
        <Button
          className={` ${
            loading
              ? "bg-yellow-400 text-black"
              : "bg-(--clr-primary) text-white"
          }   leading-2 hover:bg-(--clr-primary)/90 hover:cursor-pointer uppercase tracking-wider py-6`}
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
