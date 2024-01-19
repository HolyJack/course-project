"use server";

import { CustomFieldTypes } from "@prisma/client";
import { z } from "zod";
import prisma from "../db/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../authOptions";
import slugify from "slugify";

export const formSchema = z.object({
  name: z.string().min(2, "Item name should be atleast 2 characters."),
  tags: z.array(z.object({ value: z.string() })),
  customFieldsValues: z.array(
    z.discriminatedUnion("type", [
      z.object({
        type: z.literal(CustomFieldTypes.INT),
        id: z.number(),
        name: z.string(),
        value: z.coerce.number(),
      }),
      z.object({
        type: z.literal(CustomFieldTypes.DATE),
        id: z.number(),
        name: z.string(),
        value: z.coerce.date(),
      }),
      z.object({
        type: z.literal(CustomFieldTypes.TEXT),
        id: z.number(),
        name: z.string(),
        value: z.string(),
      }),
      z.object({
        type: z.literal(CustomFieldTypes.STRING),
        id: z.number(),
        name: z.string(),
        value: z.string(),
      }),
      z.object({
        type: z.literal(CustomFieldTypes.BOOLEAN),
        id: z.number(),
        name: z.string(),
        value: z.coerce.boolean(),
      }),
    ]),
  ),
});

const typeToFieldMap = {
  INT: "intValue",
  TEXT: "textValue",
  STRING: "stringValue",
  DATE: "dateValue",
  BOOLEAN: "booleanValue",
};

export default async function addItemAction(
  collectionSlug: string,
  data: z.infer<typeof formSchema>,
) {
  formSchema.parse(data);
  const user = (await getServerSession(authOptions))?.user;
  if (!user || !user.email) return false;
  const collection = await prisma.collection.findUnique({
    where: { slug: collectionSlug, author: { email: user.email } },
    include: { customFields: true },
  });
  if (!collection) return false;

  const tags = data.tags.map(({ value }) => ({
    name: value,
    slug: slugify(value),
  }));
  const connectTags = data.tags.map(({ value }) => ({
    tag: { connect: { name: value, slug: slugify(value) } },
  }));

  await prisma.tag.createMany({ data: tags, skipDuplicates: true });
  //this requires additional validation logic
  const date = await prisma.item.create({
    data: {
      name: data.name,
      slug: slugify(data.name),
      tags: { create: connectTags },
      collection: {
        connect: { slug: collectionSlug, author: { email: user.email } },
      },
      customFieldValues: {
        createMany: {
          data: data.customFieldsValues.map(({ id, type, value }) => ({
            [typeToFieldMap[type]]: value,
            customFieldId: id,
          })),
        },
      },
    },
  });

  return date;
}
