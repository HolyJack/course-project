import React, { Suspense } from "react";
import { unstable_setRequestLocale } from "next-intl/server";

import SearchBar from "@/components/Controlls/SearchBar";
import CollectionSearchResults from "@/components/Collection/CollectionSearchResults";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  params: { locale },
  searchParams: { fullText },
}: {
  params: { locale: string };
  searchParams: {
    fullText?: string;
  };
}) {
  unstable_setRequestLocale(locale);

  return (
    <section className="mx-auto w-full max-w-screen-md">
      <div className="space-y-6 p-6">
        <h1 className="text-3xl font-bold">Search for Collection</h1>
        <SearchBar />
      </div>
      <Suspense key={fullText}>
        <CollectionSearchResults fullText={fullText ?? ""} />
      </Suspense>
    </section>
  );
}
