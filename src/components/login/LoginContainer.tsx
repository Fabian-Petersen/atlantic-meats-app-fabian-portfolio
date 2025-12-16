import LoginForm from "./LoginForm";

const LoginContainer = () => {
  return (
    <div className="w-full max-w-[20rem] bg-white rounded-xl shadow-lg p-4">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
        Sign In
      </h2>
      <LoginForm />
      <div className="mt-4 text-center text-gray-500 text-sm">
        Forgot your password?{" "}
        <a href="/forgotPassword" className="text-blue-500 hover:underline">
          New Password
        </a>
      </div>
    </div>
  );
};

export default LoginContainer;
