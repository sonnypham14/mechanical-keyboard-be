import { IBaseRepository } from '../../../common/repositories/base-repository.interface';
import { IProduct } from '../../../common/interfaces';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from '../dto';

export const PRODUCT_REPOSITORY = 'PRODUCT_REPOSITORY';
export interface IProductRepository extends IBaseRepository<
  IProduct,
  CreateProductDto,
  UpdateProductDto
> {
  findAll(
    params: ProductQueryDto,
  ): Promise<{ data: IProduct[]; total: number }>;
  findBySlug(slug: string): Promise<IProduct | null>;
  findFeatured(limit: number): Promise<IProduct[]>;
}
