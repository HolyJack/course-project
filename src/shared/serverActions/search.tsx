"use server";
import { z } from "zod";
import prisma from "../db/db";
import { Prisma, item_fts } from "@prisma/client";
import { searchSchema } from "./schemas";

export default async function search({
  searchString,
  take,
}: z.infer<typeof searchSchema>) {
  try {
    const proccessedSearch = searchString
      ? searchString
          .split(" ")
          .map((word) => `${word}:*`)
          .join(" ")
      : "";
    const items = await prisma.$queryRaw<item_fts[]>`
      SELECT name, title, author, slug, collectionslug, authorslug, "createdAt"
      FROM 
      "item_fts"
      ${
        proccessedSearch
          ? Prisma.sql`WHERE fts @@ websearch_to_tsquery('multi_lang', ${proccessedSearch})`
          : Prisma.empty
      }
    ${
      proccessedSearch
        ? Prisma.sql`ORDER BY ts_rank(fts, websearch_to_tsquery('multi_lang', ${proccessedSearch}))`
        : Prisma.empty
    }
      ${take ? Prisma.sql`LIMIT ${take}` : Prisma.empty}`;
    return items;
  } catch {
    throw new Error("Something went wrong");
  }
}
