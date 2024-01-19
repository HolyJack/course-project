import prisma from "@/shared/db/db";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Cross } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/Dialog";

import { authOptions } from "@/shared/authOptions";
import AddItem from "@/components/Collection/AddItem";

export const dynamic = "force-dynamic";

export default async function CollectionPage({
  params,
}: {
  params: { author: string; collection: string };
}) {
  const t = await getTranslations("CollectionPage");
  const collection = await prisma.collection.findFirst({
    where: { author: { slug: params.author }, slug: params.collection },
    include: {
      items: true,
      author: { select: { name: true, email: true } },
      customFields: true,
    },
  });
  if (!collection) return redirect("/");
  const user = (await getServerSession(authOptions))?.user;
  let editAccess = false;

  if (user && user.email === collection.author.email) editAccess = true;

  return (
    <article className="mx-auto grid h-fit w-[768px] max-w-full grid-cols-1 gap-5">
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
      <section>
        <h2 className="text-2xl font-bold capitalize">{t("description")}</h2>
        <p>{collection.description}</p>
      </section>

      <section>
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold capitalize ">{t("items")}</h2>
          {editAccess && (
            <Dialog>
              <DialogTrigger asChild>
                <button>
                  <Cross
                    size={25}
                    className="hover:text-primary cursor-pointer"
                  />
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>{t("addItem.title")}</DialogTitle>
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
                  customFields={collection.customFields}
                  collectionSlug={params.collection}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
        {collection.items.length > 0 && (
          <div className="flex flex-col space-y-4 py-4">
            {collection.items.map(({ slug, name, id }) => (
              <Link
                key={id}
                href={`/collection/${params.author}/${params.collection}/${slug}`}
                className="text-bold hover:text-primary"
              >
                {name}
              </Link>
            ))}
          </div>
        )}
        {!collection.items.length && (
          <p className="text-center">{t("noItems")}</p>
        )}
      </section>
    </article>
  );
}
