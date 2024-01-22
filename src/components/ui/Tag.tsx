import Link from "next/link";
import { Badge } from "./Badge";

export default function Tag({ name }: { name: string }) {
  return (
    <Badge className="text-base">
      <Link className="w-full" href={`/collection/search?fullText=${name}`}>
        {name}
      </Link>
    </Badge>
  );
}
