import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CATEGORY_REPOSITORY } from './interfaces/category-repository.interface';
import { PrismaCategoryRepository } from './repositories/prisma-category.repository';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    {
      provide: CATEGORY_REPOSITORY,
      useClass: PrismaCategoryRepository,
    },
  ],
  exports: [CategoriesService],
})
export class CategoriesModule {}
