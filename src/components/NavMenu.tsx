"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import DarkModeButton from "./DarkModeButton";

export function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <section className="flex gap-4">
        <button
          className="h-10 w-24 rounded-full shadow shadow-shadow transition
          duration-300 hover:bg-primary hover:shadow-lg hover:shadow-primary"
          onClick={() => signOut()}
        >
          Sign Out
        </button>
        <Link
          href={"/profile"}
          className="aspect-square w-10 overflow-hidden rounded-full
          bg-background shadow hover:outline hover:outline-primary"
        >
          <Image
            src={session.user?.image || ""}
            width={40}
            height={40}
            alt="avatar"
          />
        </Link>
      </section>
    );
  }

  return (
    <button
      className="h-10 w-24 rounded-full shadow shadow-shadow"
      onClick={() => signIn()}
    >
      Sign In
    </button>
  );
}

export function NavMenu() {
  return (
    <div className="container mx-auto flex items-center justify-between gap-4">
      <h1 className="text-3xl font-bold">📦 Collections</h1>
      <div className="flex gap-4">
        <AuthButton />
        <DarkModeButton />
      </div>
    </div>
  );
}
