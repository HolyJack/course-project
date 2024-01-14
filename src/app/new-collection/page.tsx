"use server";
import { authOptions } from "@/shared/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "@/shared/db/db";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import CreateNewCollection from "@/components/CreateNewCollection";

export default async function NewCollectionPage() {
  const session = await getServerSession(authOptions);
  const topics = (await prisma.topic.findMany({ select: { name: true } })).map(
    (t) => t.name,
  );

  if (!session?.user) redirect("/api/auth/signin");

  return (
    <Card className="mx-auto">
      <CardHeader className="font-bold">Add New Collection</CardHeader>
      <CardContent>
        <CreateNewCollection topics={topics} />
      </CardContent>
    </Card>
  );
}
