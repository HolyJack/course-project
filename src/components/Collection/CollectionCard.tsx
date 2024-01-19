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
        className="relative aspect-[16/12] overflow-hidden rounded-xl
        border border-shadow object-cover"
      >
        <Image
          className="min-h-full min-w-full transition duration-300"
          src={imageUrl ?? ""}
          width={650}
          height={500}
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
      <div className="flex space-x-1.5 text-xl transition duration-300">
        <h3 className="max-w-[50%] truncate font-bold capitalize transition duration-300 group-hover:text-primary">
          {title}
        </h3>
        <p>by {author}</p>
      </div>
    </Link>
  );
}
