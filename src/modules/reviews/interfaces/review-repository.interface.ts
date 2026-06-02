import { IReview } from '../../../common/interfaces';
import { CreateReviewDto, UpdateReviewDto, ReviewQueryDto } from '../dto';

export const REVIEW_REPOSITORY = 'REVIEW_REPOSITORY';

export interface IReviewRepository {
  findAll(query: ReviewQueryDto): Promise<{ data: IReview[]; total: number }>;
  findById(id: string): Promise<IReview | null>;
  findByUserAndProduct(
    userId: string,
    productId: string,
  ): Promise<IReview | null>;
  create(userId: string, dto: CreateReviewDto): Promise<IReview>;
  update(id: string, dto: UpdateReviewDto): Promise<IReview>;
  delete(id: string): Promise<void>;
}
