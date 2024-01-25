import { getTranslations } from "next-intl/server";
import AddItem from "./AddItem";
import ItemsGrid from "./ItemsGrid";
import prisma from "@/shared/db/db";

export default async function CollectionItems({
  collectionSlug,
  authorSlug,
  editAccess,
  collectionId,
}: {
  collectionSlug: string;
  authorSlug: string;
  editAccess: boolean;
  collectionId: number;
}) {
  const items = (
    await prisma.item.findMany({
      where: { collectionId },
      include: {
        _count: { select: { likes: true } },
        tags: { include: { tag: { select: { name: true } } } },
      },
    })
  ).map((item) => ({
    name: item.name,
    slug: item.slug,
    collectionSlug,
    authorSlug,
    tags: item.tags.map((tag) => tag.tag.name),
    likes: item._count.likes,
    createdAt: item.createdAt,
  }));
  const t = await getTranslations("CollectionPage");

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-bold capitalize ">{t("items")}</h2>
        {editAccess && <AddItem collectionId={collectionId} />}
      </div>
      <ItemsGrid
        items={items}
        labels={{
          name: t("grid.name"),
          likes: t("grid.likes"),
          createAt: t("grid.createAt"),
          tags: t("grid.tags"),
        }}
      />
    </section>
  );
}
