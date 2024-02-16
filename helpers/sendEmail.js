import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const { META_PASS } = process.env;

const nodemailerConfig = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: "tymnik@meta.ua",
    pass: META_PASS,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const email = {
  to: "binoy67677@fahih.com",
  from: "tymnik@meta.ua",
  subject: "test email",
  html: "<p><strong>Test email</strong> from tymnik</p>",
};

transport
  .sendMail(email)
  .then(() => console.log("Email send success"))
  .catch((error) => console.log(error.message));

const sendMail = () => {
  return transport.sendMail(email);
};

export default sendMail;
