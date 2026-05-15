import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { BRAND_REPOSITORY } from './interfaces/brand-repository.interface';
import type { IBrandRepository } from './interfaces/brand-repository.interface';
import { CreateBrandDto, UpdateBrandDto } from './dto';
import { PaginationDto } from '../../common/dto';

@Injectable()
export class BrandsService {
  constructor(
    @Inject(BRAND_REPOSITORY)
    private readonly brandRepo: IBrandRepository,
  ) {}

  async findAll(query: PaginationDto) {
    const { page = 1, limit = 12 } = query;
    const { data, total } = await this.brandRepo.findAll({ page, limit });
    return {
      data,
      message: 'Get brands successfully',
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const brand = await this.brandRepo.findById(id);
    if (!brand) throw new NotFoundException('Brand not found');
    return { data: brand, message: 'Get brand successfully' };
  }

  async create(dto: CreateBrandDto) {
    const brand = await this.brandRepo.create(dto);
    return { data: brand, message: 'Brand created successfully' };
  }

  async update(id: string, dto: UpdateBrandDto) {
    await this.findOne(id);
    const brand = await this.brandRepo.update(id, dto);
    return { data: brand, message: 'Brand updated successfully' };
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.brandRepo.delete(id);
    return { data: null, message: 'Brand deleted successfully' };
  }
}
