"use client";

import { useRouter } from "@/shared/navigation";
import updateLikeAction from "@/shared/serverActions/updateLikeAction";
import { cn } from "@/shared/utils";
import { HeartIcon } from "lucide-react";
import { useEffect, useState } from "react";

let initial = true;

export default function Likes({
  defLikes,
  userEmail,
  itemId,
}: {
  userEmail?: string;
  defLikes: string[];
  itemId: number;
}) {
  const router = useRouter();
  const [likes, setLikes] = useState<string[]>(defLikes);
  const [like, setLike] = useState(
    userEmail ? likes.includes(userEmail) : false,
  );

  useEffect(() => {
    if (initial) {
      initial = false;
      return;
    }
    if (!userEmail) return;
    async function updateLike() {
      await updateLikeAction({ itemId, like });
    }
    const timeout = setTimeout(updateLike, 300);
    return () => {
      clearTimeout(timeout);
    };
  }, [userEmail, itemId, like]);
  return (
    <div className="inline-flex gap-1" suppressHydrationWarning>
      {likes.filter((like) => userEmail !== like).length + (like ? 1 : 0)}
      {
        <button
          onClick={() => {
            if (!userEmail) {
              return;
            }
            setLike((prev) => !prev);
          }}
          disabled={!userEmail}
          className="cursor-pointer"
          suppressHydrationWarning
        >
          <HeartIcon
            className={cn(like ? "fill-text" : "fill-transparent")}
            suppressHydrationWarning
          />
        </button>
      }
    </div>
  );
}
