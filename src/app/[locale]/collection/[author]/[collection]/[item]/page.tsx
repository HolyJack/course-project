import AddComment from "@/components/Collection/AddComment";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { authOptions } from "@/shared/authOptions";
import prisma from "@/shared/db/db";
import { Link } from "lucide-react";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

export default async function CollectionItemPage({
  params,
}: {
  params: { author: string; collection: string; item: string };
}) {
  const item = await prisma.item.findUnique({
    where: {
      slug: params.item,
      collection: { slug: params.collection, author: { slug: params.author } },
    },
    include: {
      tags: { include: { tag: { select: { name: true, slug: true } } } },
      customFieldValues: { include: { customField: true } },
      comments: {
        orderBy: { createdAt: "asc" },
        include: { author: { select: { name: true, image: true } } },
      },
    },
  });
  if (!item) redirect("/");
  const t = await getTranslations("ItemPage");
  const session = await getServerSession(authOptions);

  return (
    <div className="mx-auto w-full max-w-xl space-y-8">
      <section>
        <h1 className="text-center text-4xl font-bold">{item?.name}</h1>
        {item.tags.length && (
          <div className="flex flex-wrap gap-4 text-base">
            {item.tags.map(({ tag: { name, slug } }, id) => (
              <Badge key={id}>
                <Link
                  className="w-full"
                  href={`/collection/search?tag=${slug}`}
                >
                  {name}
                </Link>
              </Badge>
            ))}
          </div>
        )}
      </section>
      <section className="space-y-6 py-6">
        <h2 className="text-2xl font-bold">{"Comments"}</h2>
        {session?.user && <AddComment itemSlug={params.item} />}
        <ul className="space-y-6">
          {item.comments.map((comment) => (
            <li key={comment.id} className="flex gap-3">
              <div>
                <Avatar>
                  <AvatarImage src={comment.author.image ?? ""} />
                  <AvatarFallback className="capitalize">
                    {comment.author.name?.substring(0, 1) ?? ""}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2 text-sm sm:flex-row">
                  <div className="font-bold">{comment.author.name}</div>
                  <div className="text-gray-500">
                    {comment.createdAt.toLocaleString()}
                  </div>
                </div>
                <div className="text-lg">{comment.text}</div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
