import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { getTranslations } from "next-intl/server";
import CollectionItems from "./CollectionItems";
import { Suspense } from "react";
import { CollectionWithAuthorAndTopic } from "@/shared/utils/types";
import RichText from "../ui/RichText";

export default async function Collection({
  editAccess,
  collection,
}: {
  editAccess: boolean;
  collection: CollectionWithAuthorAndTopic;
}) {
  const t = await getTranslations("CollectionPage");
  return (
    <Card className="mx-auto w-full max-w-screen-md border-none shadow-none">
      <CardHeader className="gap-4 p-0 py-6 sm:p-6">
        <h1 className="text-center text-4xl font-bold capitalize">
          {collection.title}
        </h1>
        <Image
          className="border-shadow shadow-shadow h-auto w-full overflow-hidden rounded-md border shadow"
          src={collection.imgageUrl ?? ""}
          width={1000}
          height={1000}
          alt={collection.title}
        />
      </CardHeader>
      <CardContent className="space-y-6 p-0 py-6 sm:p-6">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">{t("topic")}</h2>
          <p>{collection.topic.name}</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold capitalize">{t("description")}</h2>
          <RichText content={collection.description} />
        </section>
        <Suspense>
          <CollectionItems
            authorSlug={collection.author.slug ?? ""}
            collectionSlug={collection.slug}
            editAccess={editAccess}
            collectionId={collection.id}
          />
        </Suspense>
      </CardContent>
    </Card>
  );
}
