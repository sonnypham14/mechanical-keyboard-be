import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WISHLIST_REPOSITORY } from './interfaces/wishlist-repository.interface';
import type { IWishlistRepository } from './interfaces/wishlist-repository.interface';
import { AddToWishlistDto } from './dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class WishlistService {
  constructor(
    @Inject(WISHLIST_REPOSITORY)
    private readonly wishlistRepo: IWishlistRepository,
  ) {}

  async findMyWishlist(userId: string, query: PaginationDto) {
    const { page = 1, limit = 12 } = query;
    const { data, total } = await this.wishlistRepo.findByUserId(userId, query);
    return {
      data,
      message: 'Get wishlist successfully',
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async add(userId: string, dto: AddToWishlistDto) {
    const existing = await this.wishlistRepo.findByUserAndProduct(
      userId,
      dto.productId,
    );
    if (existing) throw new BadRequestException('Product already in wishlist');

    const item = await this.wishlistRepo.add(userId, dto.productId);
    return { data: item, message: 'Added to wishlist' };
  }

  async remove(userId: string, productId: string) {
    const existing = await this.wishlistRepo.findByUserAndProduct(
      userId,
      productId,
    );
    if (!existing) throw new NotFoundException('Product not in wishlist');

    await this.wishlistRepo.remove(userId, productId);
    return { data: null, message: 'Removed from wishlist' };
  }
}
