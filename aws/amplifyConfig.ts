// $ This is the configuration file for Amplify by setting all the environment variables.

import { Amplify } from "aws-amplify";

export default function configureAmplify() {
  // console.log({
  //   userPoolId: import.meta.env.VITE_COGNITO_USERPOOL_ID,
  //   clientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
  // });
  if (
    !import.meta.env.VITE_COGNITO_USERPOOL_ID ||
    !import.meta.env.VITE_COGNITO_CLIENT_ID
  ) {
    throw new Error(
      "Missing required environment variables for Cognito configuration"
    );
  }

  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: import.meta.env.VITE_COGNITO_USERPOOL_ID,
        userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
        loginWith: {
          email: true,
        },
        userAttributes: {
          email: {
            required: true,
          },
        },
      },
    },
  });
}
