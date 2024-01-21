import prisma from "@/shared/db/db";
import CollectionCard from "./CollectionCard";
import { getTranslations } from "next-intl/server";
import { Button } from "../ui/Button";
import Link from "next/link";

const AMOUNT = 5;

export default async function RecentCollections() {
  const t = await getTranslations("RecentCollections");
  const collections = await prisma.collection.findMany({
    take: AMOUNT,
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true, slug: true } },
      topic: { select: { name: true } },
    },
  });

  if (!collections.length) return null;

  return (
    <section className="space-y-8">
      <h2 className="text-3xl">{t("title")}</h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        {collections.map(
          ({
            title,
            slug: collectionSlug,
            author: { name: author, slug: authorSlug },
            imgageUrl,
            id,
            topic: { name: topic },
          }) => (
            <CollectionCard
              key={id}
              title={title}
              collectionSlug={collectionSlug ?? ""}
              author={author ?? ""}
              authorSlug={authorSlug ?? ""}
              topic={topic}
              imageUrl={imgageUrl ?? ""}
            />
          ),
        )}

        <Button
          variant="outline"
          className="h-full w-full rounded-xl p-0 text-3xl font-bold"
        >
          <Link
            href="/collection/search?created=des"
            className="flex h-full w-full items-center justify-center"
          >
            View All
          </Link>
        </Button>
      </div>
    </section>
  );
}
