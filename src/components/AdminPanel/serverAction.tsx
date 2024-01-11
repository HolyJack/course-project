"use server";

import prisma from "@/shared/db/db";
export default async function serverAction(start: number, end: number) {
  const users = await prisma.user.findMany({
    take: end - start,
    skip: start,
  });
  return users;
}
