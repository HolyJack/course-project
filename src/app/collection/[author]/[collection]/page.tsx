import AddItem from "@/components/AddItem";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/Dialog";

import { authOptions } from "@/shared/authOptions";
import prisma from "@/shared/db/db";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CollectionPage({
  params,
}: {
  params: { author: string; collection: string };
}) {
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
        className="h-auto w-full overflow-hidden rounded-md border border-shadow shadow shadow-shadow"
        src={collection.imgageUrl ?? ""}
        width={1000}
        height={1000}
        alt={collection.title}
      />
      <section>
        <h2 className="text-2xl font-bold capitalize">Description</h2>
        <p>{collection.description}</p>
      </section>

      <section>
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold capitalize">Items</h2>
          {editAccess && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default">Add Item</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Add Item</DialogTitle>
                <AddItem
                  customFields={collection.customFields}
                  collectionSlug={params.collection}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
        {collection.items.length > 0 && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {collection.items.map(({ slug, name, id }) => (
              <Link
                key={id}
                href={`/collection/${params.author}/${params.collection}/${slug}`}
              >
                {name}
              </Link>
            ))}
          </div>
        )}
        {!collection.items.length && (
          <p className="text-center">No Items Yet</p>
        )}
      </section>
    </article>
  );
}
