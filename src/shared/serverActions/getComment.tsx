"use server";

import prisma from "@/shared/db/db";

export default async function getComment({
  itemId,
  commentId,
}: {
  itemId: number;
  commentId: string;
}) {
  const comment = await prisma.comment.findUnique({
    where: { itemId, id: commentId },
    include: { author: { select: { name: true, image: true } } },
  });

  if (!comment) throw new Error("No such comment");

  return comment;
}
