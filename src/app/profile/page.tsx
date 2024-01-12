import Profile from "@/components/Profile";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/authOptions";
import { User } from "@prisma/client";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) return redirect("/api/auth/signin");

  return <Profile user={session.user as User} />;
}
