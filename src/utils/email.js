import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ahmed.bebars2001@gmail.com",
      pass: "shuogwdtabjliabi",
    },
  });
  await transporter.sendMail({
    from: " '<test e-comm>' ahmed.bebars2001@gmail.com",
    to,
    subject,
    html,
  });
};
