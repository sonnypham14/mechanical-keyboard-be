import { Module } from '@nestjs/common';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';
import { PrismaWishlistRepository } from './repositories/prisma-wishlist.repository';
import { WISHLIST_REPOSITORY } from './interfaces/wishlist-repository.interface';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WishlistController],
  providers: [
    WishlistService,
    { provide: WISHLIST_REPOSITORY, useClass: PrismaWishlistRepository },
  ],
  exports: [WishlistService],
})
export class WishlistModule {}
