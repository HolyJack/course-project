"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import DarkModeButton from "./DarkModeButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Button } from "@/components/ui/Button";
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";

function Logo() {
  return (
    <h1 className="group text-3xl font-bold">
      📦{" "}
      <span
        className="text-text from-primary to-accent bg-gradient-to-r
            bg-clip-text transition-all duration-500 group-hover:text-transparent"
      >
        Collections
      </span>
    </h1>
  );
}

function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <Link href={"/dashboard"}>
              <AvatarImage src={session.user?.image ?? undefined} />
              <AvatarFallback className="capitalize">
                {session.user?.name?.substring(0, 1)}
              </AvatarFallback>
            </Link>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{session.user?.email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Link className="h-full w-full" href={"/profile"}>
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link className="h-full w-full" href={"/new-collection"}>
                New Collection
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut()}>
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return <Button onClick={() => signIn()}>Sign In</Button>;
}

export function NavMenu() {
  return (
    <div
      className="container mx-auto flex flex-col items-center justify-between
        gap-4 sm:flex-row"
    >
      <Link href={"/"}>
        <Logo />
      </Link>
      <div className="flex gap-4">
        <AuthButton />
        <DarkModeButton />
      </div>
    </div>
  );
}
