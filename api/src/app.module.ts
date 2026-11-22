import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { AuthModule } from "./auth/auth.module";
import { BooksModule } from "./books/books.module";
import { GenresModule } from "./genres/genres.module";
import { PrismaModule } from "./prisma/prisma.module";
import { UsersController } from "./users/users.controller";

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }]),
    PrismaModule,
    AuthModule,
    GenresModule,
    BooksModule,
  ],
  controllers: [UsersController],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
