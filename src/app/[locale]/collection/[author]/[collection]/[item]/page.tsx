import { getTranslations } from "next-intl/server";
import Item from "@/components/Collection/Item";
import { Suspense } from "react";

export default async function CollectionItemPage({
  params,
}: {
  params: { author: string; collection: string; item: string };
}) {
  const t = await getTranslations("ItemPage");

  return (
    <div className="mx-auto w-full max-w-screen-md">
      <Suspense>
        <Item
          authorSlug={params.author}
          collectionSlug={params.collection}
          slug={params.item}
        />
      </Suspense>
    </div>
  );
}
