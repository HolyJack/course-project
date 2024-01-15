import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { AuthOptions } from "next-auth";
import prisma from "@/shared/db/db";
import Github from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import slugify from "slugify";

export const authOptions: AuthOptions = {
  providers: [
    Github({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
      profile(profile) {
        return {
          id: profile.id.toString(),
          slug: slugify(
            profile.name ??
              profile.login ??
              (profile.email as string).split("@")[0],
          ),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET ?? "",
    }),
  ],
  adapter: PrismaAdapter(prisma),
};
