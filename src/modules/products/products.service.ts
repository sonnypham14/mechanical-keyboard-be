import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from './interfaces/product-repository.interface';
import type { IProductRepository } from './interfaces/product-repository.interface';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './dto';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: IProductRepository,
  ) {}

  async findAll(query: ProductQueryDto) {
    const { page = 1, limit = 12 } = query;
    const { data, total } = await this.productRepo.findAll(query);
    return {
      data,
      message: 'Get products successfully',
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const product = await this.productRepo.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    return { data: product, message: 'Get product successfully' };
  }

  async findBySlug(slug: string) {
    const product = await this.productRepo.findBySlug(slug);
    if (!product) throw new NotFoundException('Product not found');
    return { data: product, message: 'Get product successfully' };
  }

  async findFeatured() {
    const products = await this.productRepo.findFeatured(8);
    return { data: products, message: 'Get featured products successfully' };
  }

  async create(dto: CreateProductDto) {
    const product = await this.productRepo.create(dto);
    return { data: product, message: 'Product created successfully' };
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);
    const product = await this.productRepo.update(id, dto);
    return { data: product, message: 'Product updated successfully' };
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.productRepo.delete(id);
    return { data: null, message: 'Product deleted successfully' };
  }
}
