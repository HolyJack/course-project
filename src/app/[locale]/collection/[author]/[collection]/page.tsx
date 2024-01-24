import prisma from "@/shared/db/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/shared/authOptions";
import Collection from "@/components/Collection/Collection";
import { Suspense } from "react";
import { Prisma, Role } from "@prisma/client";

export const revalidate = 0;

const collectionWithAuthorAndTopic =
  Prisma.validator<Prisma.CollectionDefaultArgs>()({
    include: {
      author: { select: { name: true, slug: true, email: true } },
      topic: { select: { name: true } },
    },
  });

export type CollectionWithAuthorAndTopic = Prisma.CollectionGetPayload<
  typeof collectionWithAuthorAndTopic
>;

export default async function CollectionPage({
  params,
}: {
  params: { author: string; collection: string };
}) {
  const collection = await prisma.collection.findUnique({
    where: { slug: params.collection },
    include: collectionWithAuthorAndTopic.include,
  });
  if (!collection) return redirect("/");
  const user = (await getServerSession(authOptions))?.user;
  console.log(user);
  const editAccess =
    (user &&
      (user.email === collection.author.email || user.role === Role.ADMIN)) ??
    false;

  return (
    <Suspense>
      <Collection collection={collection} editAccess={editAccess} />
    </Suspense>
  );
}
