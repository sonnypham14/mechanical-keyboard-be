import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { IWishlistItem } from '../../../common/interfaces';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { IWishlistRepository } from '../interfaces/wishlist-repository.interface';

const wishlistInclude = {
  product: {
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      thumbnail: true,
      rating: true,
      reviewCount: true,
    },
  },
};

@Injectable()
export class PrismaWishlistRepository implements IWishlistRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(
    userId: string,
    query: PaginationDto,
  ): Promise<{ data: IWishlistItem[]; total: number }> {
    const { page = 1, limit = 12 } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.wishlistItem.findMany({
        where: { userId },
        include: wishlistInclude,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.wishlistItem.count({ where: { userId } }),
    ]);

    return { data: data.map((item) => this.mapOne(item)), total };
  }

  async findByUserAndProduct(
    userId: string,
    productId: string,
  ): Promise<IWishlistItem | null> {
    const item = await this.prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId, productId } },
      include: wishlistInclude,
    });
    return item ? this.mapOne(item) : null;
  }

  async add(userId: string, productId: string): Promise<IWishlistItem> {
    const item = await this.prisma.wishlistItem.create({
      data: { userId, productId },
      include: wishlistInclude,
    });
    return this.mapOne(item);
  }

  async remove(userId: string, productId: string): Promise<void> {
    await this.prisma.wishlistItem.delete({
      where: { userId_productId: { userId, productId } },
    });
  }

  private mapOne(item: {
    id: string;
    userId: string;
    productId: string;
    createdAt: Date;
    product: {
      id: string;
      name: string;
      slug: string;
      price: unknown;
      thumbnail: string;
      rating: number;
      reviewCount: number;
    };
  }): IWishlistItem {
    return {
      id: item.id,
      userId: item.userId,
      productId: item.productId,
      product: {
        id: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        price: Number(item.product.price),
        thumbnail: item.product.thumbnail,
        rating: item.product.rating,
        reviewCount: item.product.reviewCount,
      },
      createdAt: item.createdAt,
    };
  }
}
