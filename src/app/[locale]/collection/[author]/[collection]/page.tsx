import Collection from "@/components/Collection/Collection";
import { Suspense } from "react";

export const revalidate = 0;

export default async function CollectionPage({
  params,
}: {
  params: { author: string; collection: string };
}) {
  return (
    <Suspense>
      <Collection slug={params.collection} authorSlug={params.author} />
    </Suspense>
  );
}
