import { PrismaClient } from "@prisma/client";
import slugify from "slugify";

async function generateUniqueSlug(
  name: string,
  cf: (slug: string) => Promise<number>,
) {
  const slug = slugify(name);
  let index = 0;
  let resultSlug = slug;
  if (await cf(resultSlug)) {
    resultSlug = `${slug}-${index}`;
    index++;
  }
  return resultSlug;
}

const prismaClientSingleton = () => {
  const db = new PrismaClient().$extends({
    query: {
      user: {
        async create({ model, operation, args, query }) {
          if (!args.data) return query(args);
          const slug = await generateUniqueSlug(
            args.data.name ?? args.data.email?.split("@")[0] ?? "user",
            async (slug: string) =>
              await prisma.user.count({ where: { slug } }),
          );
          return query({ ...args, data: { ...args.data, slug } });
        },
      },
      collection: {
        async create({ model, operation, args, query }) {
          if (!args.data) return query(args);
          const slug = await generateUniqueSlug(
            args.data.title,
            async (slug: string) =>
              await prisma.collection.count({ where: { slug } }),
          );
          return query({ ...args, data: { ...args.data, slug } });
        },
      },
      item: {
        async create({ model, operation, args, query }) {
          if (!args.data) return query(args);
          const slug = await generateUniqueSlug(
            args.data.name,
            async (slug: string) =>
              await prisma.item.count({ where: { slug } }),
          );
          return query({ ...args, data: { ...args.data, slug } });
        },
      },
      tag: {
        async create({ model, operation, args, query }) {
          if (!args.data) return query(args);
          const slug = await generateUniqueSlug(
            args.data.name,
            async (slug: string) => await prisma.tag.count({ where: { slug } }),
          );
          return query({ ...args, data: { ...args.data, slug } });
        },
      },
      topic: {
        async create({ model, operation, args, query }) {
          if (!args.data) return query(args);
          const slug = await generateUniqueSlug(
            args.data.name,
            async (slug: string) =>
              await prisma.topic.count({ where: { slug } }),
          );
          return query({ ...args, data: { ...args.data, slug } });
        },
      },
    },
  });
  return db;
};

declare global {
  var prisma: ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
