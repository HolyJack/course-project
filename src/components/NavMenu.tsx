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
          className="shadow-shadow hover:bg-primary hover:shadow-primary
          border-shadow hover:border-primary bg-background h-10 w-24
          rounded-full border shadow transition duration-300 hover:shadow-lg"
          onClick={() => signOut()}
        >
          Sign Out
        </button>
        <Link
          href={"/dashboard"}
          className="bg-background hover:outline-primary border-shadow aspect-square
          w-10 overflow-hidden rounded-full border shadow hover:outline"
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
      className="shadow-shadow hover:bg-primary hover:shadow-primary
      border-shadow hover:border-primary bg-background h-10 w-24 rounded-full
      border shadow transition duration-300 hover:shadow-lg"
      onClick={() => signIn()}
    >
      Sign In
    </button>
  );
}

export function NavMenu() {
  return (
    <div
      className="container mx-auto flex flex-col items-center justify-between
        gap-4 sm:flex-row"
    >
      <Link href={"/"}>
        <h1 className="group text-3xl font-bold">
          📦{" "}
          <span
            className="text-text from-primary to-accent bg-gradient-to-r
            bg-clip-text transition-all duration-500 group-hover:text-transparent"
          >
            Collections
          </span>
        </h1>
      </Link>
      <div className="flex gap-4">
        <AuthButton />
        <DarkModeButton />
      </div>
    </div>
  );
}
