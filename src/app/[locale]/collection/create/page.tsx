import prisma from "@/shared/db/db";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { authOptions } from "@/shared/authOptions";

import AddCollection from "@/components/Collection/AddCollection";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

export const revalidate = 0;

export default async function CreateCollectionPage() {
  const t = await getTranslations("CreateCollectionPage");

  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/api/auth/signin");

  const topics = (await prisma.topic.findMany({ select: { name: true } })).map(
    (t) => t.name,
  );

  return (
    <Card
      className="mx-auto w-full max-w-screen-md border-0
      shadow-none sm:border sm:border-shadow sm:shadow sm:shadow-shadow"
    >
      <CardHeader className="p-0 py-6 sm:p-6">
        <h1 className="text-center text-3xl font-bold">{t("title")}</h1>
      </CardHeader>
      <CardContent className="p-0 py-6 sm:p-6">
        <AddCollection
          labels={{
            title: t("form.title"),
            description: t("form.description"),
            topic: t("form.topic"),
            customField: t("form.customField"),
            image: t("form.image"),
            submit: t("form.submit"),
            addCustomField: t("form.addCustomField"),
            removeCustomField: t("form.removeCustomField"),
            toast: {
              success: t("form.toast.success"),
              failure: t("form.toast.failure"),
            },
          }}
          topics={topics}
        />
      </CardContent>
    </Card>
  );
}
