import FormHeading from "../customComponents/FormHeading";
import LoginForm from "./LoginForm";

const LoginContainer = () => {
  return (
    <div className="flex flex-col gap-8 w-full max-w-100 bg-white h-100 rounded-xl shadow-lg p-4">
      <FormHeading heading="Sign In" className="text-center" />
      <LoginForm />
      <div className="mt-auto text-center pb-4">
        <a
          href="/forgotPassword"
          className="text-blue-400 hover:text-blue-500 text-sm mt-auto"
        >
          Forgot Password
        </a>
      </div>
    </div>
  );
};

export default LoginContainer;
