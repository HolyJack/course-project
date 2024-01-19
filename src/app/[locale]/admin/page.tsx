import { authOptions } from "@/shared/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "@/shared/db/db";
import AdminPanel from "@/components/Admin/AdminPanel";
import { Suspense } from "react";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || !session.user.email) return redirect("/");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") return redirect("/");

  return (
    <Suspense>
      <AdminPanel />
    </Suspense>
  );
}
