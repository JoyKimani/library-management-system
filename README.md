# Library Management System

## Database setup

The API uses Prisma with PostgreSQL. Copy `api/.env.example` to `api/.env`, replace the placeholder database connection values with your local PostgreSQL settings, then generate the Prisma client and apply the schema migration.

The starter seed data can be loaded with Prisma's seed command after the database is available. It creates four genres and sixteen books.

## Schema Decisions

`Book` references `Genre` through a `genreId` foreign key instead of embedding genre details in each book. A genre is shared data, so storing its name once avoids duplicate values and inconsistent spellings across books. The relation also lets the database enforce that each book points to an existing genre, while making it straightforward to update a genre name or query all books in a genre.
