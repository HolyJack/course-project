import Profile from "@/components/Profile";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { User, getServerSession } from "next-auth";
import { authOptions } from "@/shared/authOptions";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) return redirect("/");

  return (
    <Suspense>
      <Profile user={session.user as User} />
    </Suspense>
  );
}
