import prisma from "@/shared/db/db";

export default async function CollectionItemPage({
  params,
}: {
  params: { author: string; collection: string; item: string };
}) {
  const item = await prisma.item.findFirst({
    where: {
      slug: params.item,
      collection: { slug: params.collection, author: { slug: params.author } },
    },
    include: { customFieldValues: { include: { customField: true } } },
  });

  console.log(item);

  return <div>{item?.name}</div>;
}
