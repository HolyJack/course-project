"use server";

import prisma from "@/shared/db/db";

export default async function getUsers(start: number, end: number) {
  const users = await prisma.user.findMany({
    take: end - start,
    skip: start,
    select: { name: true, email: true, active: true, role: true },
  });
  return users;
}
