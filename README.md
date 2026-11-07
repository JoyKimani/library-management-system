# Library Management System

## Database setup

The API uses Prisma with PostgreSQL. Create a PostgreSQL database, then copy `api/.env.example` to `api/.env` and replace the placeholder connection values with your local settings. From the `api` directory, generate the Prisma client and apply the committed initial migration:

```sh
npx prisma generate
npx prisma migrate deploy
```

After installing the API dependencies, run `npx tsx prisma/seed.ts` from `api` to insert four genres and sixteen books. The seed uses upserts, so rerunning it does not create duplicates.

## Schema Decisions

`Book` references `Genre` through a `genreId` foreign key instead of embedding genre details in each book. A genre is shared data, so storing its name once avoids duplicate values and inconsistent spellings across books. The relation also lets the database enforce that each book points to an existing genre, while making it straightforward to update a genre name or query all books in a genre.
