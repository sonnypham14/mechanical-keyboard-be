import { IBaseRepository } from '../../../common/repositories/base-repository.interface';
import { IBrand } from '../../../common/interfaces';
import { CreateBrandDto, UpdateBrandDto } from '../dto';

export const BRAND_REPOSITORY = 'BRAND_REPOSITORY';

export interface IBrandRepository extends IBaseRepository<
  IBrand,
  CreateBrandDto,
  UpdateBrandDto
> {
  findBySlug(slug: string): Promise<IBrand | null>;
}
