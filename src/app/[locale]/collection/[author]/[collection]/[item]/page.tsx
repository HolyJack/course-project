import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

import prisma from "@/shared/db/db";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import CommentSection from "@/components/Collection/CommentSection";
import { ChevronLeft } from "lucide-react";
import { Separator } from "@/components/ui/Separator";
import Tag from "@/components/ui/Tag";

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
    <Card
      className="sm:border-shadow sm:shadow-shadow mx-auto w-full
      max-w-screen-md border-0 shadow-none sm:border sm:shadow"
    >
      <CardHeader className="p-0 py-6 sm:p-6">
        <div className="relative flex items-center justify-center">
          <Link href={"."} className="hover:text-primary absolute left-0">
            <ChevronLeft />
          </Link>
          <h1 className="text-center text-4xl font-bold">{item?.name}</h1>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 p-0 py-6 sm:p-6">
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
              {item.tags.map(({ tag: { name } }, id) => (
                <Tag key={id} name={name} />
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
        <Separator />
        <CommentSection itemSlug={params.item} />
      </CardContent>
    </Card>
  );
}
