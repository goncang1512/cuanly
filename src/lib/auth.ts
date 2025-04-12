import { betterAuth } from "better-auth";
import prisma from "./prisma";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { username } from "better-auth/plugins";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  socialProviders: {
    tiktok: {
      clientId: process.env.TIKTOK_CLIENT_ID as string,
      clientSecret: process.env.TIKTOK_CLIENT_SECRET as string,
      clientKey: process.env.TIKTOK_CLIENT_KEY as string,
    },
  },
  user: {
    modelName: "user",
    additionalFields: {
      phonenumber: {
        type: "string",
        required: false,
        input: true,
      },
      avatar: {
        type: "string",
        required: false,
        defaultValue: "avatar.png",
        input: true,
      },
      avatarId: {
        type: "string",
        defaultValue: "defualt",
        required: false,
        input: true,
      },
    },
  },
  plugins: [username()],
});
