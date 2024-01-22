SELECT
  c.id,
  c.title,
  c.description,
  c."imgageUrl",
  c."createdAt",
  c.slug,
  u.name AS authorname,
  u.slug AS authorslug,
  to_tsvector(
    (
      (
        (
          (
            (
              (
                (
                  (
                    ((c.title || ' ' :: text) || c.description) || ' ' :: text
                  ) || u.name
                ) || ' ' :: text
              ) || COALESCE(string_agg(items.name, ' ' :: text), '' :: text)
            ) || ' ' :: text
          ) || COALESCE(string_agg(items.tags, ' ' :: text), '' :: text)
        ) || ' ' :: text
      ) || COALESCE(string_agg(items.comments, ' ' :: text), '' :: text)
    )
  ) AS fts
FROM
  (
    (
      "Collection" c
      LEFT JOIN (
        SELECT
          i.id,
          i.name,
          i."collectionId",
          COALESCE(string_agg(tags.name, ' ' :: text), '' :: text) AS tags,
          COALESCE(string_agg(com.text, ' ' :: text), '' :: text) AS comments
        FROM
          (
            (
              "Item" i
              LEFT JOIN (
                SELECT
                  toi."itemId",
                  t.name
                FROM
                  (
                    "TagsOnItems" toi
                    LEFT JOIN "Tag" t ON ((toi."tagId" = t.id))
                  )
              ) tags ON ((i.id = tags."itemId"))
            )
            LEFT JOIN "Comment" com ON ((i.id = com."itemId"))
          )
        GROUP BY
          i.id
      ) items ON ((items."collectionId" = c.id))
    )
    LEFT JOIN "User" u ON ((c."authorId" = u.id))
  )
GROUP BY
  c.id,
  u.id;