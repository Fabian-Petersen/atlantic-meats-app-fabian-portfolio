// Login Page

import { cn } from "@/lib/utils";
import LoginContainer from "../components/login/LoginContainer";
import { sharedStyles } from "@/styles/shared";

const LoginPage = () => {
  return (
    // <main className="h-screen bg-gray-100 dark:bg-bgdark flex items-center justify-center px-4"></main>
    <main
      className={cn(
        sharedStyles.pageContainer,
        "dark:bg-(--bg-primary_dark) bg-(--pageLight) px-4 h-screen",
      )}
    >
      <div className="flex flex-col gap-8 w-full max-w-[360px] bg-white rounded-xl shadow-lg p-4 border border-white dark:border-border-dark/20 dark:bg-(--bg-secondary_dark)">
        <LoginContainer />
      </div>
    </main>
  );
};

export default LoginPage;
