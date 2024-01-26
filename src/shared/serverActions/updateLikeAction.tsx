"use server";
import prisma from "@/shared/db/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../authOptions";

export default async function updateLikeAction({
  itemId,
  like,
}: {
  itemId: number;
  like: boolean;
}) {
  const user = (await getServerSession(authOptions))?.user;

  if (!user || !user.active || !user.email)
    throw new Error("Something went wrong");

  await prisma.like.upsert({
    where: { userEmail_itemId: { userEmail: user.email, itemId } },
    update: { like },
    create: { like, userEmail: user.email, itemId },
  });
  return { status: "success" };
}
