import BiggestCollections from "@/components/BiggestCollections";
import RecentCollections from "@/components/RecentCollections";
import prisma from "@/shared/db/db";

export const revalidate = 0;

export default async function Home() {
  const topics = await prisma.topic.findMany();
  return (
    <div className="space-y-6 py-6">
      <section className="flex flex-wrap gap-4">
        {topics.map((topic, i) => (
          <div
            key={topic.id}
            className="cursor-pointer rounded-full bg-secondary px-3 py-1
            text-text shadow shadow-shadow"
          >
            {topic.name}
          </div>
        ))}
      </section>
      <BiggestCollections />
      <RecentCollections />
    </div>
  );
}
