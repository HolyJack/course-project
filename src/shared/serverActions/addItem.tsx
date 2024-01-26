"use server";

import { z } from "zod";
import prisma from "../db/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../authOptions";
import slugify from "slugify";
import { itemFormSchema } from "./schemas";

const typeToFieldMap = {
  INT: "intValue",
  TEXT: "textValue",
  STRING: "stringValue",
  DATE: "dateValue",
  BOOLEAN: "booleanValue",
};

export default async function addItemAction(
  collectionId: number,
  data: z.infer<typeof itemFormSchema>,
) {
  // checking if user is authentificated
  const user = (await getServerSession(authOptions))?.user;
  if (!user || !user.email || !user.active) return false;

  // creating additional tags
  const tags = data.tags.map(({ value }) => value);
  await prisma.tag.createMany({
    data: tags.map((name) => ({ name, slug: slugify(name) })),
    skipDuplicates: true,
  });
  const tagsIds = await prisma.tag.findMany({
    where: { name: { in: tags } },
    select: { id: true },
  });
  // finnaly adding an item + realated creating custom fields + linking all together
  const date = await prisma.item.create({
    data: {
      name: data.name,
      slug: slugify(data.name),
      tags: {
        createMany: {
          data: tagsIds.map(({ id }) => ({
            tagId: id,
          })),
        },
      },
      collection: {
        connect: { id: collectionId, author: { email: user.email } },
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
