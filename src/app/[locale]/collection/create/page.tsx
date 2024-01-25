import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/shared/authOptions";

import AddCollection from "@/components/Collection/AddCollection";
import { Suspense } from "react";

export const revalidate = 0;

export default async function CreateCollectionPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/api/auth/signin");

  return (
    <div className="mx-auto w-full max-w-screen-md ">
      <Suspense>
        <AddCollection />
      </Suspense>
    </div>
  );
}
