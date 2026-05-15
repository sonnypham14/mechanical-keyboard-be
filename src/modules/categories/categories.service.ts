import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CATEGORY_REPOSITORY } from './interfaces/category-repository.interface';
import type { ICategoryRepository } from './interfaces/category-repository.interface';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { PaginationDto } from '../../common/dto';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepo: ICategoryRepository,
  ) {}

  async findAll(query: PaginationDto) {
    const { page = 1, limit = 12 } = query;
    const { data, total } = await this.categoryRepo.findAll({ page, limit });
    return {
      data,
      message: 'Get categories successfully',
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const category = await this.categoryRepo.findById(id);
    if (!category) throw new NotFoundException('Category not found');
    return { data: category, message: 'Get category successfully' };
  }

  async create(dto: CreateCategoryDto) {
    const category = await this.categoryRepo.create(dto);
    return { data: category, message: 'Category created successfully' };
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.findOne(id);
    const category = await this.categoryRepo.update(id, dto);
    return { data: category, message: 'Category updated successfully' };
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.categoryRepo.delete(id);
    return { data: null, message: 'Category deleted successfully' };
  }
}
