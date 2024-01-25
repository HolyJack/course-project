import React from "react";
import search from "@/shared/serverActions/search";
import SearchGrid from "./SearchGrid";
import { getTranslations } from "next-intl/server";

export default async function SearchResults({
  fullText,
}: {
  fullText: string;
}) {
  const items = await search({ searchString: fullText });
  const t = await getTranslations("SearchPage");

  return (
    <section className="space-y-6">
      <h2 className="text-2xl">
        <span className="font-bold">{t("itemsFound")}</span> {items.length}
      </h2>
      <SearchGrid
        items={items}
        labels={{
          name: t("grid.name"),
          author: t("grid.author"),
          collection: t("grid.collections"),
          createdAt: t("grid.createdAt"),
        }}
      />
    </section>
  );
}
