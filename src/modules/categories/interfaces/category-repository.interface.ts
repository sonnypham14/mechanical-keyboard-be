import { IBaseRepository } from '../../../common/repositories/base-repository.interface';
import { ICategory } from '../../../common/interfaces';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto';

export const CATEGORY_REPOSITORY = 'CATEGORY_REPOSITORY';

export interface ICategoryRepository extends IBaseRepository<
  ICategory,
  CreateCategoryDto,
  UpdateCategoryDto
> {
  findBySlug(slug: string): Promise<ICategory | null>;
}
