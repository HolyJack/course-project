import Profile from "@/components/Profile";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) return redirect("/");

  return (
    <Suspense>
      <Profile user={session.user} />
    </Suspense>
  );
}
