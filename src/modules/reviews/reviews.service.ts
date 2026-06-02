import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { REVIEW_REPOSITORY } from './interfaces/review-repository.interface';
import type { IReviewRepository } from './interfaces/review-repository.interface';
import { CreateReviewDto, UpdateReviewDto, ReviewQueryDto } from './dto';
import { Role } from '../../common/constants/app.constant';

@Injectable()
export class ReviewsService {
  constructor(
    @Inject(REVIEW_REPOSITORY)
    private readonly reviewRepo: IReviewRepository,
  ) {}

  async findAll(query: ReviewQueryDto) {
    const { page = 1, limit = 12 } = query;
    const { data, total } = await this.reviewRepo.findAll(query);
    return {
      data,
      message: 'Get reviews successfully',
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const review = await this.reviewRepo.findById(id);
    if (!review) throw new NotFoundException('Review not found');
    return { data: review, message: 'Get review successfully' };
  }

  async create(userId: string, dto: CreateReviewDto) {
    const existing = await this.reviewRepo.findByUserAndProduct(
      userId,
      dto.productId,
    );
    if (existing)
      throw new BadRequestException('You have already reviewed this product');
    const review = await this.reviewRepo.create(userId, dto);
    return { data: review, message: 'Review created successfully' };
  }

  async update(id: string, userId: string, dto: UpdateReviewDto) {
    const review = await this.reviewRepo.findById(id);
    if (!review) throw new NotFoundException('Review not found');
    if (review.userId !== userId)
      throw new ForbiddenException('You can only edit your own reviews');
    const updated = await this.reviewRepo.update(id, dto);
    return { data: updated, message: 'Review updated successfully' };
  }

  async remove(id: string, userId: string, role: Role) {
    const review = await this.reviewRepo.findById(id);
    if (!review) throw new NotFoundException('Review not found');
    if (review.userId !== userId && role !== Role.ADMIN) {
      throw new ForbiddenException('You can only delete your own reviews');
    }
    await this.reviewRepo.delete(id);
    return { data: null, message: 'Review deleted successfully' };
  }
}
