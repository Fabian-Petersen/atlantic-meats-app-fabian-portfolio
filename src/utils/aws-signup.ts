import { signUp, type SignUpInput } from "aws-amplify/auth";

// example user
// const user = {
//       username: "jdoe",
//       password: "mysecurerandompassword#123",
//       options: {
//         userAttributes: {
//           email: "me@domain.com",
//           phone_number: "+12128601234", // E.164 number convention
//           given_name: "Jane",
//           role: "manager"
//           family_name: "Doe",
//           nickname: "Jane",
//         },
//       },
//     }

export async function handleSignUp(user: SignUpInput) {
  try {
    await signUp(user);
  } catch (e) {
    console.log(e);
  }
}
