import { getServerSession } from "next-auth";
import AddComment from "@/components/Collection/AddComment";
import { authOptions } from "@/shared/authOptions";
import { Suspense } from "react";
import RealtimeComments from "./RealtimeComments";
import prisma from "@/shared/db/db";
import { Comment } from "@prisma/client";

async function AddCommentController({ itemId }: { itemId: number }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return null;
  return <AddComment itemId={itemId} />;
}

async function Comments({ itemId }: { itemId: number }) {
  const comments = (await prisma.comment.findMany({
    where: { itemId },
    include: { author: { select: { name: true, image: true } } },
  })) as (Comment & { author: { name?: string; image?: string } })[];

  return <RealtimeComments comments={comments} itemId={itemId} />;
}

export default function CommentSection({ itemId }: { itemId: number }) {
  return (
    <section className="space-y-6">
      <Suspense>
        <AddCommentController itemId={itemId} />
      </Suspense>
      <Suspense>
        <Comments itemId={itemId} />
      </Suspense>
    </section>
  );
}
