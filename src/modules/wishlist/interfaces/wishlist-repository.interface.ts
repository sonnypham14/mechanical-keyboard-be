import { IWishlistItem } from '../../../common/interfaces';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export const WISHLIST_REPOSITORY = 'WISHLIST_REPOSITORY';

export interface IWishlistRepository {
  findByUserId(
    userId: string,
    query: PaginationDto,
  ): Promise<{ data: IWishlistItem[]; total: number }>;
  findByUserAndProduct(
    userId: string,
    productId: string,
  ): Promise<IWishlistItem | null>;
  add(userId: string, productId: string): Promise<IWishlistItem>;
  remove(userId: string, productId: string): Promise<void>;
}
