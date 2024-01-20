import { getServerSession } from "next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import AddComment from "@/components/Collection/AddComment";
import { authOptions } from "@/shared/authOptions";
import { Suspense } from "react";
import prisma from "@/shared/db/db";

async function AddCommentController({ itemSlug }: { itemSlug: string }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return null;
  return <AddComment itemSlug={itemSlug} />;
}

function Comment({
  image,
  author,
  createdAt,
  content,
}: {
  image: string;
  author: string;
  createdAt: Date;
  content: string;
}) {
  return (
    <section className="flex gap-3">
      <div>
        <Avatar>
          <AvatarImage src={image} />
          <AvatarFallback className="capitalize">{author}</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-col gap-2">
        <div className="inline gap-2 text-sm">
          <h3 className="font-bold">{author}</h3>
          <p className="text-xs text-gray-500">{createdAt.toLocaleString()}</p>
        </div>
        <div className="text-lg">{content}</div>
      </div>
    </section>
  );
}

async function Comments({ itemSlug }: { itemSlug: string }) {
  const comments = await prisma.comment.findMany({
    where: { item: { slug: itemSlug } },
    include: { author: { select: { name: true, image: true } } },
  });

  return (
    <ul className="space-y-6">
      {comments.map((comment) => (
        <li key={comment.id}>
          <Comment
            image={comment.author.image ?? ""}
            author={comment.author.name ?? ""}
            createdAt={comment.createdAt}
            content={comment.text}
          />
        </li>
      ))}
    </ul>
  );
}

export default function CommentSection({ itemSlug }: { itemSlug: string }) {
  return (
    <section className="space-y-6">
      <Suspense>
        <AddCommentController itemSlug={itemSlug} />
      </Suspense>
      <Suspense>
        <Comments itemSlug={itemSlug} />
      </Suspense>
    </section>
  );
}
