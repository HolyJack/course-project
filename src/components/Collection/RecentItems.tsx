import prisma from "@/shared/db/db";
import { Link } from "@/shared/navigation";
import { getTranslations } from "next-intl/server";

const AMOUNT = 5;

export default async function RecentItems() {
  const items = await prisma.item.findMany({
    take: AMOUNT,
    include: {
      collection: {
        include: { author: { select: { name: true, slug: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  const t = await getTranslations("RecentItems");

  return (
    <section className="space-y-4">
      <h2 className="text-3xl">{t("title")}</h2>
      <div className="flex flex-col gap-2 text-sm">
        {items.map((item) => (
          <div key={item.slug} className="inline-flex">
            <p className="text-gray-500">
              <Link
                href={`/collection/${item.collection.author.slug}/${item.collection.slug}/${item.slug}`}
                className="hover:text-primary text-text font-bold"
              >
                {item.name}
              </Link>{" "}
              {t("addedTo")}{" "}
              <Link
                href={`/collection/${item.collection.author.slug}/${item.collection.slug}`}
                className="hover:text-primary font-bold text-gray-400"
              >
                {item.collection.title}
              </Link>{" "}
              {t("by")}{" "}
              <Link
                href={`/collection/search?fullText=${item.collection.author.name}`}
                className="hover:text-primary font-bold text-gray-400"
              >
                {item.collection.author.name ?? "unknown"}
              </Link>{" "}
              {t("at")} {item.createdAt.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
