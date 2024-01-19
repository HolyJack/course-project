"use server";
import prisma from "../db/db";

export default async function Search(text: string) {
  const collections = await prisma.collection.findMany({
    where: {
      OR: [
        { title: { search: text } },
        { description: text },
        { items: { some: { name: { search: text } } } },
        { items: { some: { comments: { some: { text: { search: text } } } } } },
      ],
    },
  });
  return collections;
}
