import LoginForm from "./LoginForm";

const LoginContainer = () => {
  return (
    <div className="w-full max-w-100 bg-white h-100 rounded-xl shadow-lg p-4">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
        Sign In
      </h2>
      <LoginForm />
      <div className="mt-8 text-center">
        <a
          href="/forgotPassword"
          className="text-blue-400 hover:text-blue-500 text-sm"
        >
          Forgot Password
        </a>
      </div>
    </div>
  );
};

export default LoginContainer;
