import { Link, redirect } from "@/shared/navigation";
import { ChevronLeft, HeartIcon } from "lucide-react";
import Tag from "../ui/Tag";
import NavigateBack from "../Controlls/NavigateBack";
import { Separator } from "../ui/Separator";
import CommentSection from "./CommentSection";
import { getTranslations } from "next-intl/server";
import prisma from "@/shared/db/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/authOptions";
import Likes from "./Like";

export default async function Item({
  slug,
  authorSlug,
  collectionSlug,
}: {
  slug: string;
  authorSlug: string;
  collectionSlug: string;
}) {
  const t = await getTranslations("ItemPage");
  const item = await prisma.item.findUnique({
    where: {
      slug,
      collection: { slug: collectionSlug, author: { slug: authorSlug } },
    },
    include: {
      collection: { select: { title: true } },
      likes: { select: { userEmail: true } },
      tags: { include: { tag: { select: { name: true, slug: true } } } },
      customFieldValues: {
        include: {
          customField: { select: { value: true } },
        },
      },
    },
  });
  if (!item) return redirect("/");
  const likes = item.likes
    .filter((like) => like.userEmail)
    .map((like) => like.userEmail) as string[];
  const user = (await getServerSession(authOptions))?.user;

  return (
    <section className="space-y-6" suppressHydrationWarning>
      <div className="relative flex items-center justify-between">
        <NavigateBack className="hover:text-primary">
          <ChevronLeft />
        </NavigateBack>
        <h1 className="text-center text-4xl font-bold">{item?.name}</h1>
        <Likes
          defLikes={likes}
          itemId={item.id}
          userEmail={user?.email ?? undefined}
        />
      </div>
      <div className="space-y-2">
        <p>
          <span className="font-bold">Collection: </span>
          <Link
            className="hover:text-primary"
            href={`/collection/${authorSlug}/${collectionSlug}`}
          >
            {item.collection.title}
          </Link>
        </p>
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-4 text-base">
            <div className="font-bold">Tags:</div>
            {item.tags.map(({ tag: { name } }, id) => (
              <Tag key={id} name={name} />
            ))}
          </div>
        )}
        {item.customFieldValues.map((customField) => (
          <div key={customField.id}>
            <h3 className="font-bold">{customField.customField.value}</h3>
            <p>
              {customField.intValue ??
                customField.dateValue?.toLocaleString() ??
                customField.stringValue ??
                customField.textValue ??
                customField.booleanValue?.toString() ??
                ""}
            </p>
          </div>
        ))}
      </div>
      <Separator />
      <CommentSection itemId={item.id} />
    </section>
  );
}
