import emailValidator from "deep-email-validator";

export async function isEmailValid(email) {
  return emailValidator.validate(email);
}
