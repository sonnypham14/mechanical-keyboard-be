import { Injectable } from '@nestjs/common';
import { IProduct } from '../../../common/interfaces';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from '../dto';
import { IProductRepository } from '../interfaces/product-repository.interface';

@Injectable()
export class MockProductRepository implements IProductRepository {
  private products: IProduct[] = [
    {
      id: '1',
      name: 'Keychron K2 V2',
      slug: 'keychron-k2-v2',
      sku: 'KEY-K2-V2-001',
      description: 'A compact 75% wireless mechanical keyboard.',
      price: 89.99,
      compareAtPrice: null,
      thumbnail: 'https://placehold.co/600x400?text=K2',
      brand: {
        id: '1',
        name: 'Keychron',
        slug: 'keychron',
        logo: null,
        website: null,
        country: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      category: {
        id: '1',
        name: 'Mechanical Keyboards',
        slug: 'mechanical-keyboards',
        image: null,
        productCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      switchType: 'LINEAR',
      layout: 'SEVENTY_FIVE',
      connectivity: 'WIRELESS',
      colors: ['Gray'],
      material: 'Aluminum',
      weight: 1.2,
      rating: 4.5,
      reviewCount: 120,
      stock: 50,
      tags: ['wireless', '75%'],
      featured: true,
      images: [],
      specs: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
  ];

  findAll(
    params: ProductQueryDto,
  ): Promise<{ data: IProduct[]; total: number }> {
    const { page = 1, limit = 12 } = params;
    const start = (page - 1) * limit;
    const data = this.products.slice(start, start + limit);
    return Promise.resolve({ data, total: this.products.length });
  }

  findById(id: string): Promise<IProduct | null> {
    return Promise.resolve(this.products.find((p) => p.id === id) ?? null);
  }

  findBySlug(slug: string): Promise<IProduct | null> {
    return Promise.resolve(this.products.find((p) => p.slug === slug) ?? null);
  }

  findFeatured(limit: number): Promise<IProduct[]> {
    return Promise.resolve(
      this.products.filter((p) => p.featured).slice(0, limit),
    );
  }

  create(dto: CreateProductDto): Promise<IProduct> {
    const product = {
      id: Date.now().toString(),
      ...dto,
    } as unknown as IProduct;
    this.products.push(product);
    return Promise.resolve(product);
  }

  update(id: string, dto: UpdateProductDto): Promise<IProduct> {
    const index = this.products.findIndex((p) => p.id === id);
    this.products[index] = {
      ...this.products[index],
      ...(dto as Partial<IProduct>),
    };
    return Promise.resolve(this.products[index]);
  }

  delete(id: string): Promise<void> {
    this.products = this.products.filter((p) => p.id !== id);
    return Promise.resolve();
  }
}
