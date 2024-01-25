"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../authOptions";
import prisma from "../db/db";

export async function DeleteCollection({
  collectionId,
}: {
  collectionId: number;
}) {
  try {
    const user = (await getServerSession(authOptions))?.user;
    if (!user || !user.email || !user.role) throw new Error("no valid user");
    const res = await prisma.collection.delete({
      where: { id: collectionId, author: { email: user.email } },
    });
    return { title: res.title, status: "deleted" };
  } catch {
    throw new Error("Something went wrong!");
  }
}

export async function DeleteCollections({
  collectionsIds,
}: {
  collectionsIds: number[];
}) {
  const user = (await getServerSession(authOptions))?.user;
  if (!user || !user.email) throw new Error("no valid user");
  const res = await prisma.collection.deleteMany({
    where: { id: { in: collectionsIds }, author: { email: user.email } },
  });
  return { count: res.count, status: "deleted" };
}

export async function DeleteItem({ itemId }: { itemId: number }) {
  try {
    const user = (await getServerSession(authOptions))?.user;
    if (!user || !user.email) throw new Error("no valid user");
    const res = await prisma.item.delete({
      where: { id: itemId, collection: { author: { email: user.email } } },
    });
    return { status: "deleted", name: res.name };
  } catch {
    throw new Error("Something went wrong!");
  }
}

export async function DeleteItems({ itemsIds }: { itemsIds: number[] }) {
  try {
    const user = (await getServerSession(authOptions))?.user;
    if (!user || !user.email) throw new Error("no valid user");
    const res = await prisma.item.deleteMany({
      where: {
        id: { in: itemsIds },
        collection: { author: { email: user.email } },
      },
    });
    return { status: "deleted", count: res.count };
  } catch {
    throw new Error("Something went wrong!");
  }
}
