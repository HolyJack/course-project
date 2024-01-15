"use server";

import { CustomFieldTypes } from "@prisma/client";
import { z } from "zod";
import prisma from "../db/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../authOptions";
import slugify from "slugify";

const dataSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  topic: z.string(),
  customFields: z
    .array(
      z.object({ type: z.nativeEnum(CustomFieldTypes), value: z.string() }),
    )
    .optional(),
});
const collectionSchema = dataSchema.merge(z.object({ image: z.string() }));

export async function submitCollection(
  values: z.infer<typeof collectionSchema>,
) {
  console.log("submiting...");
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

  if (!authorId || !topicId) {
    console.log("something went wrong");
    return false;
  }
  console.log("authorId and topicId availabe");

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
