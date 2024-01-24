"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import { supabase } from "@/shared/utils/supabase/client";
import getComment from "@/shared/serverActions/getComment";
import { Comment } from "@prisma/client";

function CommentCard({
  image,
  author,
  createdAt,
  content,
}: {
  image: string;
  author: string;
  createdAt: Date;
  content: string;
}) {
  return (
    <section className="flex gap-3">
      <div>
        <Avatar>
          <AvatarImage src={image} />
          <AvatarFallback className="capitalize">{author}</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-col gap-2">
        <div className="inline gap-2 text-sm">
          <h3 className="font-bold">{author}</h3>
          <p className="text-xs text-gray-500">{createdAt.toLocaleString()}</p>
        </div>
        <div className="text-lg">{content}</div>
      </div>
    </section>
  );
}

export default function RealtimeComments({
  itemId,
  comments: initialComments,
}: {
  itemId: number;
  comments: (Comment & { author: { name?: string; image?: string } })[];
}) {
  const [comments, setComments] = useState(initialComments);
  useEffect(() => {
    const channel = supabase
      .channel("realtime posts")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Comment",
          filter: `itemId=eq.${itemId}`,
        },
        async (payload) => {
          {
            const newComment = await getComment({
              itemId,
              commentId: payload.new.id,
            });
            setComments((prev) =>
              prev.concat([
                newComment as Comment & {
                  author: { name?: string; image?: string };
                },
              ]),
            );
          }
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [itemId]);
  return (
    <ul className="space-y-6">
      {comments.map((comment) => (
        <li key={comment.id}>
          <CommentCard
            image={comment.author.image ?? ""}
            author={comment.author.name ?? ""}
            createdAt={comment.createdAt}
            content={comment.text}
          />
        </li>
      ))}
    </ul>
  );
}
