import Image from "next/image";
import Link from "next/link";

export function CollecionCard2({
  authorName,
  authorSlug,
  slug,
  title,
  imageUrl,
  description,
  createdAt,
}: {
  authorName: string;
  authorSlug: string;
  title: string;
  slug: string;
  imageUrl: string;
  description: string;
  createdAt: Date;
}) {
  return (
    <div className="hover:bg-primary/50 group grid w-full cursor-pointer rounded-md">
      <Link href={`/collection/${authorSlug}/${slug}`}>
        <div className="grid  grid-cols-12 grid-rows-6 gap-6 py-6 md:p-6">
          <div
            className="shadow-shadow xs:row-span-4 relative col-span-full
            row-span-3 aspect-[4/3] overflow-hidden rounded-xl  shadow
            group-hover:shadow-none sm:row-span-4 md:col-span-5 md:row-span-full"
          >
            <Image
              fill
              className="col-span-4 row-span-4 bg-black object-contain"
              src={imageUrl ?? ""}
              alt={title}
            />
          </div>
          <div className="col-span-full row-span-1 md:col-span-7 md:row-span-2">
            <h2 className=" line-clamp-1 text-2xl font-bold">{title}</h2>
            <p className="text-sm">
              {authorName} {createdAt.toLocaleString()}
            </p>
          </div>
          <p
            className="col-span-full row-span-2 line-clamp-3 sm:row-span-1
                    sm:inline-block md:col-span-7 md:row-span-4 "
          >
            {description}
          </p>
        </div>
      </Link>
    </div>
  );
}
