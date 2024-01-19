import prisma from "@/shared/db/db";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { authOptions } from "@/shared/authOptions";

import AddCollection from "@/components/Collection/AddCollection";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

export default async function CreateCollectionPage() {
  const t = await getTranslations("CreateCollectionPage");
  const session = await getServerSession(authOptions);
  const topics = (await prisma.topic.findMany({ select: { name: true } })).map(
    (t) => t.name,
  );

  if (!session?.user) redirect("/api/auth/signin");

  return (
    <Card className="mx-auto">
      <CardHeader className="font-bold">{t("title")}</CardHeader>
      <CardContent>
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
