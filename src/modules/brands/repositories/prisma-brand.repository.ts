import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { IBrand } from '../../../common/interfaces';
import { CreateBrandDto, UpdateBrandDto } from '../dto';
import { IBrandRepository } from '../interfaces/brand-repository.interface';

@Injectable()
export class PrismaBrandRepository implements IBrandRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: {
    page: number;
    limit: number;
  }): Promise<{ data: IBrand[]; total: number }> {
    const { page, limit } = params;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.brand.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.brand.count(),
    ]);

    return { data: data.map((b) => this.mapOne(b)), total };
  }

  async findById(id: string): Promise<IBrand | null> {
    const brand = await this.prisma.brand.findUnique({ where: { id } });
    return brand ? this.mapOne(brand) : null;
  }

  async findBySlug(slug: string): Promise<IBrand | null> {
    const brand = await this.prisma.brand.findUnique({ where: { slug } });
    return brand ? this.mapOne(brand) : null;
  }

  async create(dto: CreateBrandDto): Promise<IBrand> {
    const brand = await this.prisma.brand.create({ data: dto });
    return this.mapOne(brand);
  }

  async update(id: string, dto: UpdateBrandDto): Promise<IBrand> {
    const brand = await this.prisma.brand.update({
      where: { id },
      data: dto,
    });
    return this.mapOne(brand);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.brand.delete({ where: { id } });
  }

  private mapOne(brand: {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    website: string | null;
    country: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): IBrand {
    return {
      id: brand.id,
      name: brand.name,
      slug: brand.slug,
      logo: brand.logo,
      website: brand.website,
      country: brand.country,
      createdAt: brand.createdAt,
      updatedAt: brand.updatedAt,
    };
  }
}
