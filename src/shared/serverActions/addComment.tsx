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
  if (!user) throw new Error("No Active Session");
  if (!user.email) throw new Error("User Has no unique indetifier");
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
