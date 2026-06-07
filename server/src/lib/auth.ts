import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "../db/index.js";
import * as schema from "../db/schema.js";
import { sendResetPasswordEmail } from "../emails/__lib/send-resend-password-email.js";
import { sendEmailVerify } from "../emails/__lib/send-verification-email.js";

if (!process.env.FRONTEND_URL) {
  throw new Error("FRONTEND_URL is not defined");
}

export const ALLOWED_ORIGINS = [process.env.FRONTEND_URL];

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      const urlWithCallback = new URL(url);
      urlWithCallback.searchParams.set(
        "callbackURL",
        `${process.env.FRONTEND_URL}/reset-password`,
      );
      void sendResetPasswordEmail({
        from: process.env.EMAIL_FROM!,
        to: user.email,
        name: user.name,
        url: urlWithCallback.toString(),
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      const urlWithCallback = new URL(url);
      urlWithCallback.searchParams.set(
        "callbackURL",
        `${process.env.FRONTEND_URL}/dashboard`,
      );
      void sendEmailVerify({
        from: process.env.EMAIL_FROM!,
        to: user.email,
        name: user.name,
        url: urlWithCallback.toString(),
      });
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  trustedOrigins: [process.env.FRONTEND_URL!],
  baseURL: process.env.BETTER_AUTH_URL,

  advanced: {
    useSecureCookies: true,
    crossSubDomainCookies: {
      enabled: true,
    },
    // ----- For deployment -----
    // defaultCookieAttributes: {
    //   secure: true,
    //   httpOnly: true,
    //   sameSite: "none",
    //   domain: process.env.COOKIE_DOMAIN,
    // },
    // ----- For development -----
    defaultCookieAttributes: {
      secure: false,
      httpOnly: true,
      sameSite: "lax",
    },
  },
});
