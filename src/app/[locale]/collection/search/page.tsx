import React, { Suspense } from "react";

import SearchBar from "@/components/Controlls/SearchBar";
import SearchResults from "@/components/Collection/SearchResults";
import { getTranslations } from "next-intl/server";

export const revalidate = 0;
export default async function SearchPage({
  searchParams: { fullText },
}: {
  searchParams: {
    fullText?: string;
  };
}) {
  const t = await getTranslations("SearchPage");
  return (
    <section className="mx-auto w-full max-w-screen-md space-y-6 py-6">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <SearchBar placeholder={t("placeholder")} />
      <Suspense key={fullText}>
        <SearchResults fullText={fullText ?? ""} />
      </Suspense>
    </section>
  );
}
