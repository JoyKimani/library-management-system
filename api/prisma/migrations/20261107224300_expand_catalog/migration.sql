DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "User") THEN
        RAISE EXCEPTION 'Cannot add required User.password while users exist. Securely backfill passwords or reset users before applying this migration.';
    END IF;
END;
$$;

ALTER TABLE "User"
ADD COLUMN "password" TEXT NOT NULL;

ALTER TABLE "User"
DROP COLUMN "name",
DROP COLUMN "updatedAt";

ALTER TABLE "Genre"
ADD COLUMN "slug" TEXT;

UPDATE "Genre"
SET "slug" = trim(both '-' FROM regexp_replace(lower("name"), '[^a-z0-9]+', '-', 'g'));

ALTER TABLE "Genre"
ALTER COLUMN "slug" SET NOT NULL;

CREATE UNIQUE INDEX "Genre_slug_key" ON "Genre"("slug");

ALTER TABLE "Book"
ADD COLUMN "description" TEXT NOT NULL DEFAULT '',
ADD COLUMN "coverImage" TEXT,
ADD COLUMN "totalCopies" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN "availableCopies" INTEGER NOT NULL DEFAULT 1;

UPDATE "Book"
SET "description" = "title" || ' by ' || "author" || '.';

ALTER TABLE "Book"
ALTER COLUMN "description" DROP DEFAULT,
DROP COLUMN "updatedAt";
