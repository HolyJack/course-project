"use client";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";

export default function SignIn({ children }: { children: React.ReactNode }) {
  return <Button onClick={() => signIn()}>{children}</Button>;
}
