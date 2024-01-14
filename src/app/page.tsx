import BiggestCollections from "@/components/BiggestCollections";
import RecentCollections from "@/components/RecentCollections";

const TAGS = ["books", "pens", "marks"];

export const revalidate = 0;

export default function Home() {
  return (
    <div className="space-y-6 py-6">
      <section className="flex flex-wrap gap-4">
        {TAGS.map((tag, i) => (
          <div
            key={i}
            className="cursor-pointer rounded-full bg-secondary px-3 py-1 font-bold
            text-text shadow shadow-shadow"
          >
            {tag}
          </div>
        ))}
      </section>
      <BiggestCollections />
      <RecentCollections />
    </div>
  );
}
