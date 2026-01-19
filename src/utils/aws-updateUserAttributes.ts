// $ AWS Docs to update user attributes using amplify/auth
// $ https://docs.amplify.aws/gen1/react/build-a-backend/auth/manage-user-profile/

import {
  updateUserAttribute,
  type UpdateUserAttributeOutput,
} from "aws-amplify/auth";

export async function handleUpdateUserAttribute(
  attributeKey: string,
  value: string,
) {
  try {
    const output = await updateUserAttribute({
      userAttribute: {
        attributeKey,
        value,
      },
    });
    handleUpdateUserAttributeNextSteps(output);
  } catch (error) {
    console.log(error);
  }
}

function handleUpdateUserAttributeNextSteps(output: UpdateUserAttributeOutput) {
  const { nextStep } = output;

  switch (nextStep.updateAttributeStep) {
    case "CONFIRM_ATTRIBUTE_WITH_CODE": {
      const codeDeliveryDetails = nextStep.codeDeliveryDetails;
      console.log(
        `Confirmation code was sent to ${codeDeliveryDetails?.deliveryMedium}.`,
      );
      // Collect the confirmation code from the user and pass to confirmUserAttribute.
      break;
    }
    case "DONE": {
      console.log(`attribute was successfully updated.`);
      break;
    }
  }
}

// $ Note: If you change an attribute that requires confirmation (i.e. email or phone_number), the user will receive a confirmation code either to their email or cellphone. This code can be used with the confirmUserAttribute API to confirm the change.

import {
  confirmUserAttribute,
  type ConfirmUserAttributeInput,
} from "aws-amplify/auth";

export async function handleConfirmUserAttribute({
  userAttributeKey,
  confirmationCode,
}: ConfirmUserAttributeInput) {
  try {
    await confirmUserAttribute({ userAttributeKey, confirmationCode });
  } catch (error) {
    console.log(error);
  }
}
