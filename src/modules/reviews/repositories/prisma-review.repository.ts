import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { IReview } from '../../../common/interfaces';
import { CreateReviewDto, UpdateReviewDto, ReviewQueryDto } from '../dto';
import { IReviewRepository } from '../interfaces/review-repository.interface';

@Injectable()
export class PrismaReviewRepository implements IReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    query: ReviewQueryDto,
  ): Promise<{ data: IReview[]; total: number }> {
    const { page = 1, limit = 12, productId, userId } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ReviewWhereInput = {
      deletedAt: null,
      ...(productId && { productId }),
      ...(userId && { userId }),
    };

    const [data, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.review.count({ where }),
    ]);

    return { data: data.map((r) => this.mapOne(r)), total };
  }

  async findById(id: string): Promise<IReview | null> {
    const review = await this.prisma.review.findFirst({
      where: { id, deletedAt: null },
    });
    return review ? this.mapOne(review) : null;
  }

  async findByUserAndProduct(
    userId: string,
    productId: string,
  ): Promise<IReview | null> {
    const review = await this.prisma.review.findFirst({
      where: { userId, productId, deletedAt: null },
    });
    return review ? this.mapOne(review) : null;
  }

  async create(userId: string, dto: CreateReviewDto): Promise<IReview> {
    const review = await this.prisma.$transaction(async (tx) => {
      const created = await tx.review.create({
        data: {
          userId,
          productId: dto.productId,
          rating: dto.rating,
          title: dto.title,
          body: dto.body,
        },
      });
      await this.recalculateRating(tx, dto.productId);
      return created;
    });
    return this.mapOne(review);
  }

  async update(id: string, dto: UpdateReviewDto): Promise<IReview> {
    const review = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.review.update({ where: { id }, data: dto });
      await this.recalculateRating(tx, updated.productId);
      return updated;
    });
    return this.mapOne(review);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const review = await tx.review.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      await this.recalculateRating(tx, review.productId);
    });
  }

  private async recalculateRating(
    tx: Prisma.TransactionClient,
    productId: string,
  ): Promise<void> {
    const agg = await tx.review.aggregate({
      where: { productId, deletedAt: null },
      _avg: { rating: true },
      _count: { rating: true },
    });
    await tx.product.update({
      where: { id: productId },
      data: {
        rating: agg._avg.rating ?? 0,
        reviewCount: agg._count.rating,
      },
    });
  }

  private mapOne(review: {
    id: string;
    userId: string;
    productId: string;
    rating: number;
    title: string | null;
    body: string;
    verified: boolean;
    helpful: number;
    createdAt: Date;
    updatedAt: Date;
  }): IReview {
    return {
      id: review.id,
      userId: review.userId,
      productId: review.productId,
      rating: review.rating,
      title: review.title,
      body: review.body,
      verified: review.verified,
      helpful: review.helpful,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    };
  }
}
