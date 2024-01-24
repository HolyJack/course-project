import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/Dialog";
import AddItemForm from "./AddItemForm";
import { getTranslations } from "next-intl/server";

export default async function AddItem({
  collectionId,
}: {
  collectionId: number;
}) {
  const t = await getTranslations("CollectionPage.addItem");
  const tags = (await prisma.tag.findMany({ select: { name: true } })).map(
    ({ name }) => name,
  );
  const customFields = await prisma.customField.findMany({
    where: { collectionId },
  });
  const formLabels = {
    name: t("form.addTag"),
    tags: t("form.tags"),
    addTag: t("form.addTag"),
    submit: t("form.submit"),
    toast: {
      success: t("form.toast.success"),
      failure: t("form.toast.failure"),
    },
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="hover:text-primary text-2xl font-bold">+</button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto">
        <DialogTitle className="text-2xl font-bold">{t("title")}</DialogTitle>
        <AddItemForm
          labels={formLabels}
          defaultTags={tags}
          customFields={customFields}
          collectionId={collectionId}
        />
      </DialogContent>
    </Dialog>
  );
}
