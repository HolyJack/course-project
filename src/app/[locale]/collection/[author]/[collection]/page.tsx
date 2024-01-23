import prisma from "@/shared/db/db";
import { getServerSession } from "next-auth";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

import { authOptions } from "@/shared/authOptions";
import AddItem from "@/components/Collection/AddItem";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function CollectionPage({
  params,
}: {
  params: { author: string; collection: string; locale: string };
}) {
  unstable_setRequestLocale(params.locale);
  const t = await getTranslations("CollectionPage");
  const collection = await prisma.collection.findFirst({
    where: { author: { slug: params.author }, slug: params.collection },
    include: {
      items: true,
      topic: true,
      author: { select: { name: true, email: true } },
      customFields: true,
    },
  });
  if (!collection) return redirect("/");
  const tags = (await prisma.tag.findMany({ select: { name: true } })).map(
    ({ name }) => name,
  );
  const user = (await getServerSession(authOptions))?.user;
  let editAccess = false;

  if (user && user.email === collection.author.email) editAccess = true;

  return (
    <Card className="mx-auto w-full max-w-screen-md border-none shadow-none">
      <CardHeader className="gap-4 p-0 py-6 sm:p-6">
        <h1 className="text-center text-4xl font-bold capitalize">
          {collection.title}
        </h1>
        <Image
          className="border-shadow shadow-shadow h-auto w-full overflow-hidden rounded-md border shadow"
          src={collection.imgageUrl ?? ""}
          width={1000}
          height={1000}
          alt={collection.title}
        />
      </CardHeader>
      <CardContent className="space-y-6 p-0 py-6 sm:p-6">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Topic</h2>
          <p>{collection.topic.name}</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold capitalize">{t("description")}</h2>
          <p>{collection.description}</p>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold capitalize ">{t("items")}</h2>
            {editAccess && (
              <Dialog>
                <DialogTrigger asChild>
                  <button className="hover:text-primary text-2xl font-bold">
                    +
                  </button>
                </DialogTrigger>
                <DialogContent className="max-h-screen overflow-y-auto">
                  <DialogTitle className="text-2xl font-bold">
                    {t("addItem.title")}
                  </DialogTitle>
                  <AddItem
                    labels={{
                      name: t("addItem.form.name"),
                      tags: t("addItem.form.tags"),
                      addTag: t("addItem.form.addTag"),
                      submit: t("addItem.form.submit"),
                      toast: {
                        success: t("addItem.form.toast.success"),
                        failure: t("addItem.form.toast.failure"),
                      },
                    }}
                    defaultTags={tags}
                    customFields={collection.customFields}
                    collectionSlug={params.collection}
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>
          {collection.items.length > 0 && (
            <div className="flex flex-wrap gap-2 py-4">
              {collection.items.map(({ slug, name, id }) => (
                <Badge key={id} className="text-base">
                  <Link
                    href={`/collection/${params.author}/${params.collection}/${slug}`}
                  >
                    {name}
                  </Link>
                </Badge>
              ))}
            </div>
          )}
          {!collection.items.length && <p>{t("noItems")}</p>}
        </section>
      </CardContent>
    </Card>
  );
}
