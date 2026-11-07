import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const genres = [
  { name: "Fantasy" },
  { name: "Mystery" },
  { name: "Science Fiction" },
  { name: "Historical Fiction" },
];

const books = [
  { title: "The Hobbit", author: "J.R.R. Tolkien", isbn: "9780547928227", genre: "Fantasy" },
  { title: "A Wizard of Earthsea", author: "Ursula K. Le Guin", isbn: "9780547773742", genre: "Fantasy" },
  { title: "The Name of the Wind", author: "Patrick Rothfuss", isbn: "9780756404741", genre: "Fantasy" },
  { title: "The Once and Future King", author: "T.H. White", isbn: "9780441627400", genre: "Fantasy" },
  { title: "The Hound of the Baskervilles", author: "Arthur Conan Doyle", isbn: "9780486295680", genre: "Mystery" },
  { title: "Murder on the Orient Express", author: "Agatha Christie", isbn: "9780062693662", genre: "Mystery" },
  { title: "The Big Sleep", author: "Raymond Chandler", isbn: "9780394758282", genre: "Mystery" },
  { title: "The Moonstone", author: "Wilkie Collins", isbn: "9780140434088", genre: "Mystery" },
  { title: "Dune", author: "Frank Herbert", isbn: "9780441172719", genre: "Science Fiction" },
  { title: "Kindred", author: "Octavia E. Butler", isbn: "9780807083697", genre: "Science Fiction" },
  { title: "The Left Hand of Darkness", author: "Ursula K. Le Guin", isbn: "9780441478125", genre: "Science Fiction" },
  { title: "The Martian", author: "Andy Weir", isbn: "9780553418026", genre: "Science Fiction" },
  { title: "The Book Thief", author: "Markus Zusak", isbn: "9780375842207", genre: "Historical Fiction" },
  { title: "All the Light We Cannot See", author: "Anthony Doerr", isbn: "9781501173219", genre: "Historical Fiction" },
  { title: "The Nightingale", author: "Kristin Hannah", isbn: "9781250080400", genre: "Historical Fiction" },
  { title: "The Pillars of the Earth", author: "Ken Follett", isbn: "9780451225245", genre: "Historical Fiction" },
];

async function main(): Promise<void> {
  for (const genre of genres) {
    await prisma.genre.upsert({
      where: { name: genre.name },
      update: {},
      create: genre,
    });
  }

  for (const book of books) {
    const genre = await prisma.genre.findUniqueOrThrow({
      where: { name: book.genre },
    });

    await prisma.book.upsert({
      where: { isbn: book.isbn },
      update: {
        title: book.title,
        author: book.author,
        genreId: genre.id,
      },
      create: {
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        genreId: genre.id,
      },
    });
  }
}

main()
  .catch((error: unknown) => {
    console.error("Failed to seed the database:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
