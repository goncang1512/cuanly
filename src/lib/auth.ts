import { betterAuth } from "better-auth";
import prisma from "./prisma";
import { prismaAdapter } from "better-auth/adapters/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
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
});
