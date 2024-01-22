import prisma from "@/shared/db/db";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

export default async function Tags() {
  const tags = await prisma.tag.findMany({
    orderBy: { items: { _count: "desc" } },
  });
  return (
    <section className="flex flex-wrap gap-4 ">
      {tags.map((tag) => (
        <Badge key={tag.id} className="text-base">
          <Link
            className="w-full"
            href={`/collection/search?fullText=${tag.slug}`}
          >
            {tag.name}
          </Link>
        </Badge>
      ))}
    </section>
  );
}
