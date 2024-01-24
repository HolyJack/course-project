import { authOptions } from "@/shared/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AdminPanel from "@/components/Admin/AdminPanel";
import { Suspense } from "react";
import { Role } from "@prisma/client";

export const revalidate = 0;

export default async function AdminPage() {
  const user = (await getServerSession(authOptions))?.user;
  if (!user || user.role !== Role.ADMIN) redirect("/");
  return (
    <Suspense>
      <AdminPanel />
    </Suspense>
  );
}
