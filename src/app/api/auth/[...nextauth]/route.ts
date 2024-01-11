import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { AuthOptions } from "next-auth";
import Github from "next-auth/providers/github";
import prisma from "@/shared/db/db";

export const authOptions: AuthOptions = {
  providers: [
    Github({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
  ],
  adapter: PrismaAdapter(prisma),
};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
