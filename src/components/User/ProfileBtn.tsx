"use client";

import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Link } from "@/shared/navigation";

export default function ProfileBtn({
  labels,
  username,
  email,
  img,
}: {
  labels: { signout: string; profile: string; newCollection: string };
  username: string;
  email: string;
  img: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={img} />
          <AvatarFallback className="capitalize">
            {username.substring(0, 1)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link className="h-full w-full" href={"/collection/my-collections"}>
              {labels.profile}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link className="h-full w-full" href={"/collection/create"}>
              {labels.newCollection}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          {labels.signout}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
