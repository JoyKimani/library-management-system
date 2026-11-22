import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: { genreId?: string; search?: string; page?: string; limit?: string } = {}) {
    const page = Math.max(1, Number.parseInt(query.page || "1", 10) || 1);
    const limit = Math.max(1, Number.parseInt(query.limit || "10", 10) || 10);
    const where: Prisma.BookWhereInput = {};

    if (query.genreId) {
      const genreId = Number.parseInt(query.genreId, 10);
      if (!Number.isNaN(genreId)) where.genreId = genreId;
    }
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: "insensitive" } },
        { author: { contains: query.search, mode: "insensitive" } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.book.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: { genre: true },
        orderBy: { id: "asc" },
      }),
      this.prisma.book.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({ where: { id }, include: { genre: true } });
    if (!book) throw new NotFoundException("Book not found");
    return book;
  }

  create(dto: CreateBookDto) {
    return this.prisma.book.create({
      data: {
        title: dto.title,
        author: dto.author,
        isbn: dto.isbn,
        description: dto.description || `${dto.title} by ${dto.author}.`,
        coverImage: dto.coverImage,
        totalCopies: dto.totalCopies,
        availableCopies: dto.totalCopies,
        genreId: dto.genreId,
      },
      include: { genre: true },
    });
  }

  async update(id: number, dto: UpdateBookDto) {
    await this.findOne(id);
    return this.prisma.book.update({
      where: { id },
      data: dto,
      include: { genre: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.book.delete({ where: { id } });
  }
}
