// $ This function request a confirmation code from the API using the users username (email). The confirmation code must be used with the confirmResetPassword function.

import { resetPassword, type ResetPasswordOutput } from "aws-amplify/auth";

export async function handleResetPassword(username: string) {
  try {
    const output = await resetPassword({ username });
    handleResetPasswordNextSteps(output);
  } catch (error) {
    console.log(error);
  }
}

function handleResetPasswordNextSteps(output: ResetPasswordOutput) {
  const { nextStep } = output;

  switch (nextStep.resetPasswordStep) {
    case "CONFIRM_RESET_PASSWORD_WITH_CODE": {
      const codeDeliveryDetails = nextStep.codeDeliveryDetails;

      console.log(
        `Confirmation code was sent to ${codeDeliveryDetails.deliveryMedium}`
      );
      // Collect the confirmation code and pass it to confirmResetPassword
      break;
    }

    case "DONE": {
      console.log("Successfully reset password.");
      break;
    }
  }
}
