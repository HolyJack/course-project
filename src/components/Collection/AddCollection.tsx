import prisma from "@/shared/db/db";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import AddCollectionForm from "./AddCollectionForm";

export default async function AddCollection() {
  const t = await getTranslations("CreateCollectionPage");

  const topics = (await prisma.topic.findMany({ select: { name: true } })).map(
    (t) => t.name,
  );

  return (
    <Card className="sm:shadow-shadowborder-0 shadow-none sm:border sm:border-shadow sm:shadow">
      <CardHeader className="p-0 py-6 sm:p-6">
        <h1 className="text-center text-3xl font-bold">{t("title")}</h1>
      </CardHeader>
      <CardContent className="p-0 py-6 sm:p-6">
        <AddCollectionForm
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
