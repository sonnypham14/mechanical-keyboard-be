import { Injectable } from '@nestjs/common';
import { IBrand } from '../../../common/interfaces';
import { CreateBrandDto, UpdateBrandDto } from '../dto';
import { IBrandRepository } from '../interfaces/brand-repository.interface';

@Injectable()
export class MockBrandRepository implements IBrandRepository {
  private brands: IBrand[] = [
    {
      id: '1',
      name: 'Keychron',
      slug: 'keychron',
      logo: null,
      website: 'https://keychron.com',
      country: 'Hong Kong',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Glorious',
      slug: 'glorious',
      logo: null,
      website: 'https://gloriousgaming.com',
      country: 'USA',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  findAll(params: {
    page: number;
    limit: number;
  }): Promise<{ data: IBrand[]; total: number }> {
    const { page, limit } = params;
    const start = (page - 1) * limit;
    const data = this.brands.slice(start, start + limit);
    return Promise.resolve({ data, total: this.brands.length });
  }

  findById(id: string): Promise<IBrand | null> {
    return Promise.resolve(this.brands.find((b) => b.id === id) ?? null);
  }

  findBySlug(slug: string): Promise<IBrand | null> {
    return Promise.resolve(this.brands.find((b) => b.slug === slug) ?? null);
  }

  create(dto: CreateBrandDto): Promise<IBrand> {
    const brand: IBrand = {
      id: Date.now().toString(),
      name: dto.name,
      slug: dto.slug,
      logo: dto.logo ?? null,
      website: dto.website ?? null,
      country: dto.country ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.brands.push(brand);
    return Promise.resolve(brand);
  }

  update(id: string, dto: UpdateBrandDto): Promise<IBrand> {
    const index = this.brands.findIndex((b) => b.id === id);
    this.brands[index] = {
      ...this.brands[index],
      ...dto,
      updatedAt: new Date(),
    };
    return Promise.resolve(this.brands[index]);
  }

  delete(id: string): Promise<void> {
    this.brands = this.brands.filter((b) => b.id !== id);
    return Promise.resolve();
  }
}
