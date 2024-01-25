import React from "react";
import search from "@/shared/serverActions/search";
import SearchGrid from "./SearchGrid";

export default async function SearchResults({
  fullText,
}: {
  fullText: string;
}) {
  const items = await search({ searchString: fullText });

  return (
    <section className="space-y-6">
      <h2 className="text-2xl">
        <span className="font-bold">Search Results</span> {items.length}
      </h2>
      <SearchGrid items={items} />
    </section>
  );
}
