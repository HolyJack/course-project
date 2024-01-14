import prisma from "@/shared/db/db";

export default async function CollectionItemPage({
  params,
}: {
  params: { author: string; collection: string; item: string };
}) {
  const item = await prisma.item.findFirst({
    where: {
      name: params.item,
      collection: { title: params.collection, author: { name: params.author } },
    },
    include: { customFieldValues: { include: { customField: true } } },
  });

  console.log(item);

  return <div>{item?.name}</div>;
}
