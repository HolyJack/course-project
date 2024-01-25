import prisma from "@/shared/db/db";

import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import CollectionItems from "./CollectionItems";
import RichText from "../ui/RichText";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { Role } from "@prisma/client";
import { collectionWithAuthorAndTopic } from "@/shared/utils/types";
import { authOptions } from "@/shared/authOptions";

export default async function Collection({
  slug,
  authorSlug,
}: {
  slug: string;
  authorSlug: string;
}) {
  const collection = await prisma.collection.findUnique({
    where: { slug, author: { slug: authorSlug } },
    include: collectionWithAuthorAndTopic.include,
  });
  if (!collection) return redirect("/");
  const user = (await getServerSession(authOptions))?.user;
  const editAccess =
    (user &&
      (user.email === collection.author.email || user.role === Role.ADMIN)) ??
    false;
  const t = await getTranslations("CollectionPage");
  return (
    <section className="space-y-6">
      <h1 className="text-center text-4xl font-bold capitalize">
        {collection.title}
      </h1>
      <Image
        className="h-auto w-full overflow-hidden rounded-md border border-shadow shadow shadow-shadow"
        src={collection.imgageUrl ?? ""}
        width={1000}
        height={1000}
        alt={collection.title}
      />
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">{t("topic")}</h2>
        <p>{collection.topic.name}</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold capitalize">{t("description")}</h2>
        <RichText content={collection.description} />
      </section>
      <Suspense>
        <CollectionItems
          authorSlug={collection.author.slug ?? ""}
          collectionSlug={collection.slug}
          editAccess={editAccess}
          collectionId={collection.id}
        />
      </Suspense>
    </section>
  );
}
