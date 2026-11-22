import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsNotEmpty()
  isbn: string;

  @IsInt()
  @IsPositive()
  totalCopies: number;

  @IsInt()
  @IsPositive()
  genreId: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  coverImage?: string;
}
