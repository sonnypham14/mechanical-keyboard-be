import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { PrismaReviewRepository } from './repositories/prisma-review.repository';
import { REVIEW_REPOSITORY } from './interfaces/review-repository.interface';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ReviewsController],
  providers: [
    ReviewsService,
    { provide: REVIEW_REPOSITORY, useClass: PrismaReviewRepository },
  ],
  exports: [ReviewsService],
})
export class ReviewsModule {}
