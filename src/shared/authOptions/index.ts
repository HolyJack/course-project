import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { AuthOptions } from "next-auth";
import Github from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import slugify from "slugify";
import { Role, User } from "@prisma/client";
import prisma from "../db/db";

export const authOptions: AuthOptions = {
  //@ts-ignore
  adapter: PrismaAdapter(prisma),
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
          role: profile.role ?? Role.AUTHOR,
          active: true,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET ?? "",
      profile(profile) {
        return {
          id: profile.sub,
          name: `${profile.given_name} ${profile.family_name}`,
          email: profile.email,
          image: profile.picture,
          slug: slugify(profile.name),
          role: profile.role ?? Role.AUTHOR,
          active: true,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, user, ...props }) {
      session.user.role = user.role;
      session.user.active = user.active ?? false;

      if ((user as User).active === false) {
        await prisma.session.deleteMany({
          where: { user: { id: user.id } },
        });
      }

      return session;
    },
    async signIn({ user }) {
      if (!(user as User).active) return false;
      return true;
    },
  },
};
