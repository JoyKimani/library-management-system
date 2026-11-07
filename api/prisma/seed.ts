import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const genres = [
  { name: "Fantasy", slug: "fantasy" },
  { name: "Science Fiction", slug: "science-fiction" },
  { name: "Mystery", slug: "mystery" },
  { name: "Biography", slug: "biography" },
];

const books = [
  { title: "The Hobbit", author: "J.R.R. Tolkien", isbn: "9780547928227", genre: "Fantasy" },
  { title: "A Wizard of Earthsea", author: "Ursula K. Le Guin", isbn: "9780547773742", genre: "Fantasy" },
  { title: "The Name of the Wind", author: "Patrick Rothfuss", isbn: "9780756404741", genre: "Fantasy" },
  { title: "The Once and Future King", author: "T.H. White", isbn: "9780441627400", genre: "Fantasy" },
  { title: "Dune", author: "Frank Herbert", isbn: "9780441172719", genre: "Science Fiction" },
  { title: "Kindred", author: "Octavia E. Butler", isbn: "9780807083697", genre: "Science Fiction" },
  { title: "The Left Hand of Darkness", author: "Ursula K. Le Guin", isbn: "9780441478125", genre: "Science Fiction" },
  { title: "The Martian", author: "Andy Weir", isbn: "9780553418026", genre: "Science Fiction" },
  { title: "The Hound of the Baskervilles", author: "Arthur Conan Doyle", isbn: "9780486295680", genre: "Mystery" },
  { title: "Murder on the Orient Express", author: "Agatha Christie", isbn: "9780062693662", genre: "Mystery" },
  { title: "The Big Sleep", author: "Raymond Chandler", isbn: "9780394758282", genre: "Mystery" },
  { title: "The Moonstone", author: "Wilkie Collins", isbn: "9780140434088", genre: "Mystery" },
  { title: "Educated", author: "Tara Westover", isbn: "9780399590504", genre: "Biography" },
  { title: "Becoming", author: "Michelle Obama", isbn: "9781524763138", genre: "Biography" },
  { title: "Steve Jobs", author: "Walter Isaacson", isbn: "9781451648539", genre: "Biography" },
  { title: "Long Walk to Freedom", author: "Nelson Mandela", isbn: "9780316548182", genre: "Biography" },
];

async function main(): Promise<void> {
  for (const genre of genres) {
    await prisma.genre.upsert({
      where: { name: genre.name },
      update: { slug: genre.slug },
      create: genre,
    });
  }

  for (const book of books) {
    const genre = await prisma.genre.findUniqueOrThrow({
      where: { name: book.genre },
    });
    const data = {
      title: book.title,
      author: book.author,
      description: `${book.title} by ${book.author}.`,
      totalCopies: 3,
      availableCopies: 3,
      genreId: genre.id,
    };

    await prisma.book.upsert({
      where: { isbn: book.isbn },
      update: data,
      create: {
        ...data,
        isbn: book.isbn,
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
