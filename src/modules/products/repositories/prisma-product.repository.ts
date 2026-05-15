import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { IProduct } from '../../../common/interfaces';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from '../dto';
import { IProductRepository } from '../interfaces/product-repository.interface';

const productInclude = {
  brand: true,
  category: true,
  images: { orderBy: { order: 'asc' as const } },
  specs: true,
};

@Injectable()
export class PrismaProductRepository implements IProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    params: ProductQueryDto,
  ): Promise<{ data: IProduct[]; total: number }> {
    const {
      page = 1,
      limit = 12,
      search,
      categoryId,
      brandId,
      minPrice,
      maxPrice,
      switchType,
      layout,
      connectivity,
      sortBy,
    } = params;

    const where: Prisma.ProductWhereInput = {
      deletedAt: null,
      ...(search && {
        name: { contains: search, mode: 'insensitive' },
      }),
      ...(categoryId && { categoryId }),
      ...(brandId && { brandId }),
      ...(minPrice !== undefined || maxPrice !== undefined
        ? { price: { gte: minPrice, lte: maxPrice } }
        : {}),
      ...(switchType && { switchType: switchType as never }),
      ...(layout && { layout: layout as never }),
      ...(connectivity && { connectivity: connectivity as never }),
    };

    const orderBy = this.resolveOrderBy(sortBy);

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: productInclude,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return { data: data.map((p) => this.mapOne(p)), total };
  }

  async findById(id: string): Promise<IProduct | null> {
    const product = await this.prisma.product.findFirst({
      where: { id, deletedAt: null },
      include: productInclude,
    });
    return product ? this.mapOne(product) : null;
  }

  async findBySlug(slug: string): Promise<IProduct | null> {
    const product = await this.prisma.product.findFirst({
      where: { slug, deletedAt: null },
      include: productInclude,
    });
    return product ? this.mapOne(product) : null;
  }

  async findFeatured(limit: number): Promise<IProduct[]> {
    const products = await this.prisma.product.findMany({
      where: { featured: true, deletedAt: null },
      include: productInclude,
      take: limit,
    });
    return products.map((p) => this.mapOne(p));
  }

  async create(dto: CreateProductDto): Promise<IProduct> {
    const product = await this.prisma.product.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        sku: dto.sku,
        description: dto.description,
        price: dto.price,
        compareAtPrice: dto.compareAtPrice,
        thumbnail: dto.thumbnail,
        brandId: dto.brandId,
        categoryId: dto.categoryId,
        switchType: dto.switchType as never,
        layout: dto.layout as never,
        connectivity: dto.connectivity as never,
        colors: dto.colors ?? [],
        material: dto.material,
        weight: dto.weight,
        stock: dto.stock ?? 0,
        tags: dto.tags ?? [],
        featured: dto.featured ?? false,
      },
      include: productInclude,
    });
    return this.mapOne(product);
  }

  async update(id: string, dto: UpdateProductDto): Promise<IProduct> {
    const product = await this.prisma.product.update({
      where: { id },
      data: dto,
      include: productInclude,
    });
    return this.mapOne(product);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  private resolveOrderBy(
    sortBy?: string,
  ): Prisma.ProductOrderByWithRelationInput {
    switch (sortBy) {
      case 'price_asc':
        return { price: 'asc' };
      case 'price_desc':
        return { price: 'desc' };
      case 'rating':
        return { rating: 'desc' };
      case 'featured':
        return { featured: 'desc' };
      default:
        return { createdAt: 'desc' };
    }
  }

  private mapOne(
    product: Prisma.ProductGetPayload<{ include: typeof productInclude }>,
  ): IProduct {
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: Number(product.price),
      compareAtPrice: product.compareAtPrice
        ? Number(product.compareAtPrice)
        : null,
      thumbnail: product.thumbnail,
      brand: product.brand,
      category: product.category,
      switchType: product.switchType,
      layout: product.layout,
      connectivity: product.connectivity,
      colors: product.colors,
      material: product.material,
      weight: product.weight,
      rating: product.rating,
      reviewCount: product.reviewCount,
      stock: product.stock,
      sku: product.sku,
      tags: product.tags,
      featured: product.featured,
      images: product.images ?? [],
      specs: product.specs ?? [],
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      deletedAt: product.deletedAt,
    };
  }
}
