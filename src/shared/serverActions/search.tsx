"use server";
import { z } from "zod";
import prisma from "../db/db";
import { Prisma, fts } from "@prisma/client";
import { searchSchema } from "./schemas";

export default async function search({
  searchString,
  take,
}: z.infer<typeof searchSchema>) {
  try {
    const collectionsRaw = await prisma.$queryRaw<fts[]>`
      WITH search
      AS (
      SELECT
      to_tsquery(string_agg(lexeme || ':*', ' & ' order by positions))
      AS 
      query
      FROM
      unnest(to_tsvector(${searchString}))
      )
      SELECT title, slug, authorname, authorslug, description, "imgageUrl", "createdAt"
      FROM 
      search,
      "fts"
      ${searchString ? Prisma.sql`WHERE fts @@ search.query` : Prisma.empty}
      LIMIT ${take}`;
    return collectionsRaw;
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong");
  }
}
