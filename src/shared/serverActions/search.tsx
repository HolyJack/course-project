"use server";
import prisma from "../db/db";

export default async function Search(text: string) {
  console.log(text);
  const collections = await prisma.collection.findMany({
    take: 10,
    where: {
      OR: [
        { title: { search: text } },
        { description: text },
        { items: { some: { name: { search: text } } } },
        { items: { some: { comments: { some: { text: { search: text } } } } } },
      ],
    },
  });
  console.log(collections);
  return collections;
}
