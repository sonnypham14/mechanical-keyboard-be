import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ICategory } from '../../../common/interfaces';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto';
import { ICategoryRepository } from '../interfaces/category-repository.interface';

@Injectable()
export class PrismaCategoryRepository implements ICategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: {
    page: number;
    limit: number;
  }): Promise<{ data: ICategory[]; total: number }> {
    const { page, limit } = params;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.category.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.category.count(),
    ]);

    return { data: this.mapMany(data), total };
  }

  async findById(id: string): Promise<ICategory | null> {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    return category ? this.mapOne(category) : null;
  }

  async findBySlug(slug: string): Promise<ICategory | null> {
    const category = await this.prisma.category.findUnique({
      where: { slug },
    });
    return category ? this.mapOne(category) : null;
  }

  async create(dto: CreateCategoryDto): Promise<ICategory> {
    const category = await this.prisma.category.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        image: dto.image,
      },
    });
    return this.mapOne(category);
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<ICategory> {
    const category = await this.prisma.category.update({
      where: { id },
      data: dto,
    });
    return this.mapOne(category);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.category.delete({
      where: { id },
    });
  }

  // Map Prisma type → Domain Interface
  private mapOne(category: {
    id: string;
    name: string;
    slug: string;
    image: string | null;
    productCount: number;
    createdAt: Date;
    updatedAt: Date;
  }): ICategory {
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      image: category.image,
      productCount: category.productCount,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  private mapMany(
    categories: Parameters<typeof this.mapOne>[0][],
  ): ICategory[] {
    return categories.map((c) => this.mapOne(c));
  }
}
