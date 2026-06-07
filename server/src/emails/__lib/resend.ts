import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

if (!process.env.AUTH_RESEND_KEY) {
  throw new Error("AUTH_RESEND_KEY is not defined");
}

export const resend = new Resend(process.env.AUTH_RESEND_KEY);
