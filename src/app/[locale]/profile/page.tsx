import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/authOptions";
import { User } from "@prisma/client";
import Profile from "@/components/User/Profile";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) return redirect("/api/auth/signin");

  return <Profile user={session.user as User} />;
}
