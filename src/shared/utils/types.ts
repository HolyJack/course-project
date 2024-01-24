import { Prisma } from "@prisma/client";

export const collectionWithAuthorAndTopic =
  Prisma.validator<Prisma.CollectionDefaultArgs>()({
    include: {
      author: { select: { name: true, slug: true, email: true } },
      topic: { select: { name: true } },
    },
  });

export type CollectionWithAuthorAndTopic = Prisma.CollectionGetPayload<
  typeof collectionWithAuthorAndTopic
>;
