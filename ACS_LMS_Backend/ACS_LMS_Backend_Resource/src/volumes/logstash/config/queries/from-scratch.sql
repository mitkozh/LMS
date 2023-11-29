WITH RECURSIVE category_tree AS (
    SELECT
        id,
        name,
        description,
        parent_category_id,
        name::text AS path
    FROM
        category
    WHERE
        parent_category_id IS NULL

    UNION ALL

    SELECT
        c.id,
        c.name,
        c.description,
        c.parent_category_id,
        ct.path || '->' || c.name
    FROM
        category c
            JOIN
        category_tree ct ON c.parent_category_id = ct.id
)
SELECT
    b.id AS id,
    b.title AS book_title,
    b.description AS book_description,
    b.image_id,
    b.deleted,
    b.updated_at,
    string_agg(DISTINCT ct.path, ', ') AS categories,
    string_agg(DISTINCT a.id || ':' || a.name, ', ') AS authors
FROM
    book b
        LEFT JOIN
    book_category bc ON b.id = bc.book_id
        LEFT JOIN
    category_tree ct ON bc.category_id = ct.id
        LEFT JOIN
    book_author ba ON b.id = ba.book_id
        LEFT JOIN
    author a ON ba.author_id = a.id
GROUP BY
    b.id;
