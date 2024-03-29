import { Role } from "@prisma/client";
import { type DefaultSession, type DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      role: Role;
      active: boolean;
    };
  }
  interface User extends DefaultUser {
    role: Role;
    active?: boolean;
  }
}
