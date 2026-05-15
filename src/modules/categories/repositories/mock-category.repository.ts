import { Injectable } from '@nestjs/common';
import { ICategory } from '../../../common/interfaces';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto';
import { ICategoryRepository } from '../interfaces/category-repository.interface';

@Injectable()
export class MockCategoryRepository implements ICategoryRepository {
  private categories: ICategory[] = [
    {
      id: '1',
      name: 'Mechanical Keyboards',
      slug: 'mechanical-keyboards',
      image: null,
      productCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Switches',
      slug: 'switches',
      image: null,
      productCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  findAll(params: {
    page: number;
    limit: number;
  }): Promise<{ data: ICategory[]; total: number }> {
    const { page, limit } = params;
    const start = (page - 1) * limit;
    const data = this.categories.slice(start, start + limit);
    return Promise.resolve({ data, total: this.categories.length });
  }

  findById(id: string): Promise<ICategory | null> {
    return Promise.resolve(this.categories.find((c) => c.id === id) ?? null);
  }

  findBySlug(slug: string): Promise<ICategory | null> {
    return Promise.resolve(
      this.categories.find((c) => c.slug === slug) ?? null,
    );
  }

  create(dto: CreateCategoryDto): Promise<ICategory> {
    const category: ICategory = {
      id: Date.now().toString(),
      name: dto.name,
      slug: dto.slug,
      image: dto.image ?? null,
      productCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.categories.push(category);
    return Promise.resolve(category);
  }

  update(id: string, dto: UpdateCategoryDto): Promise<ICategory> {
    const index = this.categories.findIndex((c) => c.id === id);
    this.categories[index] = {
      ...this.categories[index],
      ...dto,
      updatedAt: new Date(),
    };
    return Promise.resolve(this.categories[index]);
  }

  delete(id: string): Promise<void> {
    this.categories = this.categories.filter((c) => c.id !== id);
    return Promise.resolve();
  }
}
