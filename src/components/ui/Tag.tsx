import { Link } from "@/shared/navigation";
import { Badge } from "./Badge";

export default function Tag({ name }: { name: string }) {
  return (
    <Link href={`/collection/search?fullText=${name}`}>
      <Badge className="text-base">{name}</Badge>
    </Link>
  );
}
