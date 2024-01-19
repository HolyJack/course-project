import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/authOptions";
import { User } from "@prisma/client";
import Profile from "@/components/User/Profile";
import { unstable_setRequestLocale } from "next-intl/server";

export default async function ProfilePage({
  params,
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(params.locale);
  const session = await getServerSession(authOptions);

  if (!session?.user) return redirect("/api/auth/signin");

  return <Profile user={session.user as User} />;
}
