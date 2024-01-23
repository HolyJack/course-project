import { getServerSession } from "next-auth";
import AddComment from "@/components/Collection/AddComment";
import { authOptions } from "@/shared/authOptions";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { createClient } from "@/shared/utils/supabase/server";
import RealtimeComments from "./RealtimeComments";

async function AddCommentController({ itemSlug }: { itemSlug: string }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return null;
  return <AddComment itemSlug={itemSlug} />;
}

async function Comments({ itemSlug }: { itemSlug: string }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const itemId = (
    await prisma.item.findUnique({
      where: { slug: itemSlug },
      select: { id: true },
    })
  )?.id;
  if (!itemId) return null;
  const res = await supabase
    .from("Comment")
    .select("*, User(name, image), Item!inner(id, slug)")
    .eq("Item.slug", itemSlug)
    .order("createdAt");
  const comments = res.data;
  if (!comments) return;

  return (
    <RealtimeComments
      comments={comments.map((comment) => ({
        id: comment.id,
        text: comment.text,
        createdAt: new Date(comment.createdAt),
        User: {
          name: comment.User?.name ?? "",
          image: comment.User?.image ?? "",
        },
      }))}
      itemId={itemId}
    />
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
