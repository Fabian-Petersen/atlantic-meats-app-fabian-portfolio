// import { useNavigate } from "react-router-dom";

// // $ Sonner toaster for notifications
// import { toast } from "sonner";

// // $ React-Hook-Form, zod & schema
// import { LoginSchema } from "../schemas/index";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";

// // $ Function handling the signin to aws
// import { awsCognitoLogin } from "../utils/aws-signin";
// import { fetchUserAttributes } from "aws-amplify/auth";

// type FormValues = z.infer<typeof LoginSchema>;

// // $ Form Schema
// const {
//   // register,
//   // handleSubmit,
//   formState: { errors },
// } = useForm<FormValues>({
//   resolver: zodResolver(LoginSchema),
// });

// const useHandleSubmitLogin = () => {
//   const navigate = useNavigate();

//   // $ Logic for the Login Form
//   // const { reset } = useForm();

//   const form = useForm<z.infer<typeof LoginSchema>>({
//     resolver: zodResolver(LoginSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   // $ Start the transition to the pending state
//   const handleSubmit = async (data: FormValues) => {
//     // $ try-catch to sign into aws cognito
//     try {
//       //$ awsLogin is the function handling the signin to aws cognito using amplify "/utils/aws-login.ts"
//       const result = await awsCognitoLogin(data.email, data.password);
//       // $ assign the user attributes to the global state to use where required
//       if (!result) {
//         toast("The login attempt was unsuccessful");
//         return; // prevent going forward if login fails
//       } else {
//         const attributes = await fetchUserAttributes();
//         // setUserAttributes(attributes);
//         navigate("/dashboard");
//         // console.log("attributes", attributes);
//         toast(`Welcome Back ${attributes?.name}`);
//         // console.log("user attributes in the state:", userAttributes);
//       }

//       // $ Route to the dashboard page if successfull.
//     } catch (error) {
//       let errorMessage = "unexpected error";

//       if (error instanceof Error) {
//         errorMessage = error.message;
//       } else if (
//         typeof error === "object" &&
//         error !== null &&
//         "message" in error
//       ) {
//         errorMessage = (error as { message: string }).message;
//       }
//       toast("The login attempt was unsuccessful.");
//       console.error("Login error:", error);
//     }
//   };
//   return {
//     // isPending,
//     errors,
//     // success,
//     form,
//     handleSubmit: form.handleSubmit(handleSubmit),
//   };
// };

// export default useHandleSubmitLogin;
