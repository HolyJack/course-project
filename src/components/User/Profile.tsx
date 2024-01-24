import prisma from "@/shared/db/db";
import CollectionsGrid from "../Collection/CollectionsGrid";
import { collectionWithAuthorAndTopic } from "@/shared/utils/types";

export default async function MyCollections({ email }: { email: string }) {
  const collections = await prisma.collection.findMany({
    where: { author: { email } },
    include: collectionWithAuthorAndTopic.include,
  });

  if (collections.length === 0) return null;

  const collectionsFlatten = collections.map((collection) => ({
    ...collection,
    topic: collection.topic.name,
  }));

  console.log(collectionsFlatten);
  return <CollectionsGrid collections={collectionsFlatten} />;
}
