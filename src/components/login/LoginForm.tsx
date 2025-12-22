import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
// import { PasswordToggleInput } from "@/components/PasswordToggleInput";

// $ React-Hook-Form, zod & schema
import { LoginSchema } from "../../schemas/index";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// $ Function handling the signin to aws
import { awsCognitoLogin } from "../../utils/aws-signin";
import { fetchUserAttributes } from "aws-amplify/auth";

import FormRowInput from "../customComponents/FormRowInput";
import FormRowSelect from "../customComponents/FormRowSelect";
// import { useGlobalContext } from "@/useGlobalContext";

type FormValues = z.infer<typeof LoginSchema>;

// const { userAttributes, setUserAttributes } = useGlobalContext();

const LoginForm = () => {
  const navigate = useNavigate();

  // $ Form Schema
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(LoginSchema),
  });

  const handleLoginSubmit = async (data: FormValues) => {
    // $ try-catch to sign into aws cognito
    try {
      //$ awsLogin is the function handling the signin to aws cognito using amplify "/utils/aws-login.ts"
      const result = await awsCognitoLogin(data.email, data.password);
      // $ assign the user attributes to the global state to use where required
      if (!result) {
        toast("The login attempt was unsuccessful");
        return; // prevent going forward if login fails
      } else {
        const attributes = await fetchUserAttributes();
        // setUserAttributes(attributes);
        navigate("/dashboard");
        // console.log("attributes", attributes);
        toast(`Welcome Back ${attributes?.name}`);
        // console.log("user attributes in the state:", userAttributes);
      }

      // $ Route to the dashboard page if successfull.
    } catch (error) {
      let errorMessage = "unexpected error";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
      ) {
        errorMessage = (error as { message: string }).message;
      }
      toast("The login attempt was unsuccessful." + errorMessage);
      console.error("Login error:", error);
    }
  };

  return (
    <form
      className="flex flex-col gap-8 rounded-lg max-w-xl text-gray-700"
      onSubmit={handleSubmit(handleLoginSubmit)}
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
          className="bg-(--clr-primary) text-white leading-2 hover:bg-(--clr-primary)/90 hover:cursor-pointer uppercase tracking-wider"
          type="submit"
          // disabled={disableSubmit}
        >
          Sign in
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
