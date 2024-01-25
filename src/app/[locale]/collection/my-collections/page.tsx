import MyCollections from "@/components/User/Profile";
import { authOptions } from "@/shared/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const revalidate = 0;

export default async function MyCollectionsPage({}) {
  const email = (await getServerSession(authOptions))?.user.email;
  if (!email) redirect("/");

  return (
    <div className="mx-auto w-full max-w-screen-md">
      <Suspense>
        <MyCollections email={email} />
      </Suspense>
    </div>
  );
}
