import React from "react";
import { unstable_setRequestLocale } from "next-intl/server";

import { Separator } from "@/components/ui/Separator";
import { CollecionCard2 } from "@/components/Collection/CollectionCard2";
import Search from "@/shared/serverActions/search";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: {
    fullText?: string;
  };
}) {
  unstable_setRequestLocale(locale);

  const collections = await Search({
    searchString: searchParams.fullText ?? "",
  });

  return (
    <section className="mx-auto w-full max-w-screen-md">
      <h1 className="p-6 text-3xl">
        <span className="font-bold">Search Results</span> {collections.length}
      </h1>
      <div>
        <Separator />
        {collections.map((collection, id) => (
          <React.Fragment key={id}>
            <CollecionCard2
              title={collection.title ?? ""}
              description={collection.description ?? ""}
              imageUrl={collection.imgageUrl ?? ""}
              slug={collection.slug}
              createdAt={collection.createdAt}
              authorName={collection.authorname ?? ""}
              authorSlug={collection.authorslug}
            />
            <Separator />
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
