import BiggestCollections from "@/components/Collection/BiggestCollections";
import RecentCollections from "@/components/Collection/RecentCollections";
import Tags from "@/components/Collection/Tags";
import { Suspense } from "react";

export const revalidate = 0;

export default function Home() {
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
