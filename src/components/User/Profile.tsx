import prisma from "@/shared/db/db";
import CollectionsGrid from "../Collection/CollectionsGrid";
import { collectionWithAuthorAndTopic } from "@/shared/utils/types";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";

export default async function MyCollections({ email }: { email: string }) {
  const collections = await prisma.collection.findMany({
    where: { author: { email } },
    include: collectionWithAuthorAndTopic.include,
  });
  if (collections.length === 0) return null;
  const t = await getTranslations("MyCollectionsPage");

  return (
    <section className="mx-auto w-full max-w-screen-md space-y-6 py-6">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <Suspense>
        <CollectionsGrid
          collections={collections}
          labels={{
            name: t("grid.name"),
            topic: t("grid.topic"),
            description: t("grid.description"),
            createdAt: t("grid.createdAt"),
          }}
        />
      </Suspense>
    </section>
  );
}
