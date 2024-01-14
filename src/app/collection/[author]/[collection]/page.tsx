import { authOptions } from "@/shared/authOptions";
import prisma from "@/shared/db/db";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export default async function CollectionPage({
  params,
}: {
  params: { author: string; collection: string };
}) {
  const collection = await prisma.collection.findFirst({
    where: { author: { name: params.author }, title: params.collection },
    include: { items: true, author: { select: { email: true } } },
  });

  if (!collection) return redirect("/");

  const session = await getServerSession(authOptions);

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
        <h2 className="text-center text-2xl font-bold capitalize">
          Description
        </h2>
        <p>{collection.description}</p>
      </section>

      <section>
        <h2 className="text-center text-2xl font-bold capitalize">Items</h2>
        {collection.items.length > 0 && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {collection.items.map(({ name, id }) => (
              <p key={id}>{name}</p>
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
