import nodemailer from "nodemailer";
import dotenv from "dotenv";
import ejs from "ejs";
import path from "path";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: "bilalali.wdev@gmail.com",
    clientId: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
});
//Render an ejs email template
const renderEmailTemplate = async (
  templateName: string,
  data: Record<string, any>
): Promise<string> => {
  const templatePath = path.join(
    process.cwd(),
    "apps",
    "auth-service",
    "src",
    "utils",
    "email-templates",
    `${templateName}.ejs`
  );
  return ejs.renderFile(templatePath, data);
};

//send an email using nodemailer
export const sendEmail = async (
  to: string,
  subject: string,
  templateName: string,
  data: Record<string, any>
): Promise<boolean> => {
  try {
    const html = await renderEmailTemplate(templateName, data);
    await transporter.sendMail({
      from: `bilalali.wdev@gmail.com`,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.log("Error while sending email : ", error);
    return false
  }
};

// export const sendEmail = async (
//   to: string,
//   subject: string,
//   templateName: string,
//   data: Record<string, any>
// ): Promise<boolean> => {
//   try {
//     const html = await renderEmailTemplate(templateName, data);
//     await transporter.sendMail({
//       from: `bilalali.wdev@gmail.com`,
//       to,
//       subject,
//       html,
//     });
//     return true; // success
//   } catch (error) {
//     console.error("Error while sending email:", error);
//     return false; // failure
//   }
// };
