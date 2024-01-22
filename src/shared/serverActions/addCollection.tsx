"use server";

import { z } from "zod";
import prisma from "../db/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../authOptions";
import slugify from "slugify";
import { collectionSchema } from "./schemas";

export async function addCollection(values: z.infer<typeof collectionSchema>) {
  collectionSchema.parse(values);
  const topicId = (
    await prisma.topic.findFirst({
      where: { name: values.topic },
      select: { id: true },
    })
  )?.id;
  const session = await getServerSession(authOptions);
  const authorId = (
    await prisma.user.findFirst({
      where: { email: session?.user?.email },
    })
  )?.id;

  if (!authorId || !topicId) throw new Error("Wrong author");

  const collection = {
    title: values.title,
    slug: slugify(values.title),
    description: values.description ?? "",
    topicId,
    authorId,
    imgageUrl: values.image,
    customFields: values.customFields
      ? {
          create: values.customFields.map(({ value, type }) => ({
            value,
            type,
          })),
        }
      : undefined,
  };
  const result = await prisma.collection.create({ data: { ...collection } });
  return { createdAt: result.createdAt };
}
