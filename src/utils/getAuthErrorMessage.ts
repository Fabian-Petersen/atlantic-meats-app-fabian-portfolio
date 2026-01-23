type CognitoAuthError = Error & {
  name?: string;
  message: string;
};

const isCognitoAuthError = (error: unknown): error is CognitoAuthError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
};

export const getAuthErrorMessage = (error: unknown): string => {
  if (isCognitoAuthError(error)) {
    switch (error.name) {
      case "NotAuthorizedException":
        return "Incorrect email or password.";

      case "UserNotConfirmedException":
        return "Please confirm your email before signing in.";

      case "UserNotFoundException":
        return "No account found with this email address.";

      case "PasswordResetRequiredException":
        return "You must reset your password before signing in.";

      default:
        return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
};
