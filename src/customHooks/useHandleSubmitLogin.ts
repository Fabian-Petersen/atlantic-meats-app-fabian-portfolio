import { useState, useTransition } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// $ Import the action from the actions folder
import login from "../../src/actions/login";

import { useForm } from "react-hook-form";
// $ Importing the form schema
import { LoginSchema } from "../schemas/index";

const useHandleSubmitLogin = () => {
  // $ State to manage the form submission between the pending and success states.
  const [isPending, startTransition] = useTransition();

  // $ State to manage the form error and success messages
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const navigate = useNavigate();

  // $ Logic for the Login Form
  const { reset } = useForm();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // $ Start the transition to the pending state
  const handleSubmit = (values: { email: string; password: string }) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      // !:: TODO: Fix the data any type error!!!!
      login(values).then((data) => {
        const { success, error } = data;
        if (data) {
          setSuccess(success);
          console.log(data);
          navigate("/dashboard");
          // $ Reset the form fields after successful submission
          reset({
            email: "",
            password: "",
          });
          setError(error);
        }
      });
    });
  };
  return {
    isPending,
    error,
    success,
    form,
    handleSubmit: form.handleSubmit(handleSubmit),
  };
};

export default useHandleSubmitLogin;
