import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import prisma from "@/shared/db/db";
import { unstable_setRequestLocale } from "next-intl/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: {
    tag?: string;
  };
}) {
  unstable_setRequestLocale(locale);

  const baseQuery = {
    include: {
      author: { select: { slug: true, name: true } },
      _count: { select: { items: true } },
    },
  };
  let collections;
  if (searchParams.tag) {
    collections = await prisma.collection.findMany({
      ...baseQuery,
      where: {
        items: {
          some: { tags: { some: { tag: { slug: searchParams.tag } } } },
        },
      },
    });
  } else {
    collections = await prisma.collection.findMany({
      ...baseQuery,
    });
  }
  return (
    <section className="mx-auto w-full max-w-xl space-y-6">
      <h1 className="text-bold text-3xl">Search Results</h1>
      <div className="space-y-6">
        {collections.map((collection, id) => (
          <Card key={id}>
            <CardHeader>
              <CardTitle>
                <h2>
                  <Link
                    className="text-xl hover:text-primary"
                    href={`/collection/${collection.author.slug}/${collection.slug}`}
                  >
                    {collection.title}
                  </Link>
                </h2>
              </CardTitle>
              <CardDescription>
                items: {collection._count.items}
              </CardDescription>
            </CardHeader>
            <CardContent className="line-clamp-3">
              {collection.description}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
