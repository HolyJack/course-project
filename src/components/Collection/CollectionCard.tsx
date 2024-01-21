import Image from "next/image";
import Link from "next/link";

export default function CollectionCard({
  title,
  collectionSlug,
  author,
  authorSlug,
  topic,
  imageUrl,
}: {
  title: string;
  collectionSlug: string;
  author: string;
  authorSlug: string;
  topic: string;
  imageUrl: string;
}) {
  return (
    <Link
      href={`/collection/${authorSlug}/${collectionSlug}`}
      className="group space-y-3 "
    >
      <div
        className="border-shadow relative aspect-[16/12] overflow-hidden
        rounded-xl border"
      >
        <Image
          className="object-cover transition duration-300"
          src={imageUrl ?? ""}
          fill={true}
          alt={title}
        />
        <div
          className="absolute left-0 top-0 flex h-full w-full items-end
                bg-gradient-to-b from-transparent to-black/75 opacity-0
                transition duration-300 group-hover:opacity-100"
        >
          <div className="p-5 text-white">
            <p className="text-sm">Topic</p>
            <p className="capitalize">{topic}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 text-xl transition duration-300">
        <h3 className="group-hover:text-primary max-w-[50%] truncate font-bold capitalize transition duration-300">
          {title}
        </h3>
        <p>by {author}</p>
      </div>
    </Link>
  );
}
