import prisma from "@/shared/db/db";
import CollectionCard from "./CollectionCard";

const AMOUNT = 5;

export default async function RecentCollections() {
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
      <h2 className="text-3xl">Recent Collections</h2>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 2xl:grid-cols-3">
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
      </div>
      <div></div>
    </section>
  );
}
