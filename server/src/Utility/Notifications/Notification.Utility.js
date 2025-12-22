import { sendVerificationEmail } from "./sendEmail.js"; 

export const sendOTP = async (user, otp) => {
  
  if (user.email) {
    await sendVerificationEmail(user.email, user.username, otp);
  }

};