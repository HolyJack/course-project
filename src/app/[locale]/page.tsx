import { unstable_setRequestLocale } from "next-intl/server";

import BiggestCollections from "@/components/Collection/BiggestCollections";
import Tags from "@/components/Collection/Tags";
import RecentItems from "@/components/Collection/RecentItems";

export const revalidate = 0;

export default function Home({ params }: { params: { locale: string } }) {
  unstable_setRequestLocale(params.locale);
  return (
    <div className="space-y-8 py-8">
      <Tags />
      <RecentItems />
      <BiggestCollections />
    </div>
  );
}
