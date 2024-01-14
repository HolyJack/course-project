import prisma from "@/shared/db/db";
import CollectionCard from "./CollectionCard";

const AMOUNT = 5;

export default async function BiggestCollections() {
  const collections = await prisma.collection.findMany({
    take: AMOUNT,
    orderBy: { items: { _count: "desc" } },
    include: {
      author: { select: { name: true } },
      topic: { select: { name: true } },
    },
  });

  return (
    <section className="space-y-8">
      <h2 className="text-3xl">Biggest Collections</h2>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 2xl:grid-cols-3">
        {collections.map(
          ({
            title,
            author: { name: author },
            imgageUrl,
            id,
            topic: { name: topic },
          }) => (
            <CollectionCard
              key={id}
              title={title}
              author={author ?? ""}
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
