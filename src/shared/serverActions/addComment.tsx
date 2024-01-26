"use server";
import { getServerSession } from "next-auth";
import prisma from "../db/db";
import { authOptions } from "../authOptions";

export default async function addComment({
  itemId,
  text,
}: {
  itemId: number;
  text: string;
}) {
  const user = (await getServerSession(authOptions))?.user;
  if (!user || !user.email || !user.active) throw new Error("No valid user");
  const authorId = (
    await prisma.user.findUnique({
      where: { email: user.email },
    })
  )?.id;
  if (!authorId) throw new Error("User doesnt exist");
  const res = await prisma.comment.create({
    data: { text: text, itemId, authorId },
  });
  return res;
}
