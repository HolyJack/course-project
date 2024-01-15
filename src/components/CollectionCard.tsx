import Image from "next/image";
import Link from "next/link";

export default function CollectionCard({
  title,
  author,
  topic,
  imageUrl,
}: {
  title: string;
  author: string;
  topic: string;
  imageUrl: string;
}) {
  return (
    <Link href={`/collection/${author}/${title}`} className="group space-y-3 ">
      <div
        className="border-shadow relative aspect-[16/12] overflow-hidden
        rounded-xl border object-cover"
      >
        <Image
          className="h-full transition duration-300"
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
      <h3 className="text-xl transition duration-300">
        <span className="group-hover:text-primary font-bold capitalize transition duration-300">
          {title}
        </span>{" "}
        by {author}
      </h3>
    </Link>
  );
}
