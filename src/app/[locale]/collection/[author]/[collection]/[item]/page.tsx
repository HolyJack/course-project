import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

import prisma from "@/shared/db/db";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import CommentSection from "@/components/Collection/CommentSection";
import { ChevronLeft } from "lucide-react";

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
      collection: { select: { title: true } },
      tags: { include: { tag: { select: { name: true, slug: true } } } },
      customFieldValues: {
        include: {
          customField: { select: { value: true } },
        },
      },
    },
  });
  if (!item) redirect("/");
  const t = await getTranslations("ItemPage");

  return (
    <Card className="mx-auto w-full max-w-screen-sm">
      <CardHeader>
        <div className="relative flex items-center justify-center">
          <Link href={"."} className="hover:text-primary absolute left-0">
            <ChevronLeft />
          </Link>
          <h1 className="text-center text-4xl font-bold">{item?.name}</h1>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <p>
            <span className="font-bold">Collection: </span>
            <Link
              className="hover:text-primary"
              href={`/collection/${params.author}/${params.collection}`}
            >
              {item.collection.title}
            </Link>
          </p>
          {item.tags.length && (
            <div className="flex flex-wrap gap-4 text-base">
              <div className="font-bold">Tags:</div>
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
          {item.customFieldValues.map((customField) => (
            <div key={customField.id}>
              <p>
                <span className="font-bold">
                  {customField.customField.value}
                </span>
                {": "}
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
        <CommentSection itemSlug={params.item} />
      </CardContent>
    </Card>
  );
}
