import prisma from "@/shared/db/db";
import Tag from "../ui/Tag";

export default async function Tags() {
  const tags = await prisma.tag.findMany({
    orderBy: { items: { _count: "desc" } },
    select: { id: true, name: true },
    where: { NOT: { items: { none: {} } } },
  });
  return (
    <section className="flex flex-wrap gap-4 ">
      {tags.map((tag) => (
        <Tag key={tag.id} name={tag.name} />
      ))}
    </section>
  );
}
