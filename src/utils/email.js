import nodemailer from "nodemailer";
import "dotenv/config";

/**
 *
 * @param {*} to para quem é enviado
 * @param {*} name quem envia
 * @param {*} body corpo do email
 * @param {*} subject assunto
 */
async function sendMail(to, name, body, subject) {
  const smtp = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.PASS_KEY,
    },
  });

  await smtp.sendMail({
    to,
    name,
    subject,
    html: body,
  });
}

export default sendMail;
