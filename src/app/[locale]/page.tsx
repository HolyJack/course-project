import { unstable_setRequestLocale } from "next-intl/server";
import { Suspense } from "react";

import BiggestCollections from "@/components/Collection/BiggestCollections";
import RecentCollections from "@/components/Collection/RecentCollections";
import Tags from "@/components/Collection/Tags";

export const revalidate = 0;

export default function Home({ params }: { params: { locale: string } }) {
  unstable_setRequestLocale(params.locale);
  return (
    <div className="space-y-6 py-6">
      <Tags />
      <BiggestCollections />
      <Suspense>
        <RecentCollections />
      </Suspense>
    </div>
  );
}
