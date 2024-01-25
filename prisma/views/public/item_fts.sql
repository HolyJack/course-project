SELECT
  i.id,
  i.name,
  i.slug,
  i."createdAt",
  col.title,
  col.slug AS collectionslug,
  col.author,
  col.authorslug,
  (
    (
      (
        (
          (
            to_tsvector('multi_lang' :: regconfig, i.name) || tsvector_agg(tag.tag_fts)
          ) || to_tsvector('multi_lang' :: regconfig, col.author)
        ) || to_tsvector('multi_lang' :: regconfig, col.title)
      ) || tsvector_agg(
        to_tsvector(
          'multi_lang' :: regconfig,
          COALESCE(c.text, ' ' :: text)
        )
      )
    ) || tsvector_agg(
      to_tsvector(
        'multi_lang' :: regconfig,
        COALESCE(col.description, '' :: text)
      )
    )
  ) AS fts
FROM
  (
    (
      (
        "Item" i
        LEFT JOIN "Comment" c ON ((c."itemId" = i.id))
      )
      LEFT JOIN (
        SELECT
          collection.id,
          collection.title,
          collection.description,
          collection.slug,
          u.name AS author,
          u.slug AS authorslug
        FROM
          (
            "Collection" collection
            LEFT JOIN "User" u ON ((collection."authorId" = u.id))
          )
      ) col ON ((i."collectionId" = col.id))
    )
    LEFT JOIN (
      SELECT
        toi."itemId" AS id,
        to_tsvector('multi_lang' :: regconfig, t.name) AS tag_fts
      FROM
        (
          "TagsOnItems" toi
          LEFT JOIN "Tag" t ON ((t.id = toi."tagId"))
        )
    ) tag ON ((tag.id = i.id))
  )
GROUP BY
  i.id,
  i.name,
  i.slug,
  col.title,
  col.slug,
  col.author,
  col.authorslug;