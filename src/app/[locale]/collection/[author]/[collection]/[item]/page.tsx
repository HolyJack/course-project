import AddComment from "@/components/Collection/AddComment";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/Card";
import { authOptions } from "@/shared/authOptions";
import prisma from "@/shared/db/db";
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
      customFieldValues: { include: { customField: true } },
      comments: { include: { author: true } },
    },
  });
  if (!item) redirect("/");
  const t = await getTranslations("ItemPage");
  const session = await getServerSession(authOptions);

  return (
    <div className="mx-auto w-[512px]">
      <section>
        <h1 className="text-center text-3xl font-bold">{item?.name}</h1>
      </section>
      <section>
        {session?.user && <AddComment itemSlug={params.item} />}
        <ul>
          {item.comments.map((comment) => (
            <li key={comment.id}>
              <Card>
                <CardHeader>{comment.author.name}</CardHeader>
                <CardDescription>
                  {comment.createdAt.toLocaleString()}
                </CardDescription>
                <CardContent>{comment.text}</CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
