import { Link, redirect } from "@/shared/navigation";
import { ChevronLeft } from "lucide-react";
import Tag from "../ui/Tag";
import NavigateBack from "../Controlls/NavigateBack";
import { Separator } from "../ui/Separator";
import CommentSection from "./CommentSection";

export default async function Item({
  slug,
  authorSlug,
  collectionSlug,
}: {
  slug: string;
  authorSlug: string;
  collectionSlug: string;
}) {
  const item = await prisma.item.findUnique({
    where: {
      slug,
      collection: { slug: collectionSlug, author: { slug: authorSlug } },
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
  if (!item) return redirect("/");

  return (
    <section className="space-y-6">
      <div className="relative flex items-center justify-center">
        <NavigateBack className="hover:text-primary absolute left-0">
          <ChevronLeft />
        </NavigateBack>
        <h1 className="text-center text-4xl font-bold">{item?.name}</h1>
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
