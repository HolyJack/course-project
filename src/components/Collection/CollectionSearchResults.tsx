import React from "react";
import { CollecionCard2 } from "./CollectionCard2";
import { Separator } from "../ui/Separator";
import search from "@/shared/serverActions/search";

export default async function CollectionSearchResults({
  fullText,
}: {
  fullText: string;
}) {
  const collections = await search({ searchString: fullText });

  return (
    <section>
      <h2 className="p-6 text-2xl">
        <span className="font-bold">Search Results</span> {collections.length}
      </h2>
      <Separator />
      <div>
        {collections.map(
          (
            {
              title,
              description,
              imgageUrl,
              slug,
              createdAt,
              authorname,
              authorslug,
            },
            id,
          ) => (
            <React.Fragment key={id}>
              <CollecionCard2
                title={title ?? ""}
                description={description ?? ""}
                imageUrl={imgageUrl ?? ""}
                slug={slug}
                createdAt={createdAt}
                authorName={authorname ?? ""}
                authorSlug={authorslug}
              />
              <Separator />
            </React.Fragment>
          ),
        )}
      </div>
    </section>
  );
}
