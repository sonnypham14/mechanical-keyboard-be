import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../../common/dto';

export type SortBy =
  | 'featured'
  | 'price_asc'
  | 'price_desc'
  | 'newest'
  | 'rating';

export class ProductQueryDto extends PaginationDto {
  @ApiPropertyOptional({ example: 'keychron k2' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 'category-id' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ example: 'brand-id' })
  @IsOptional()
  @IsString()
  brandId?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ example: 500 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({ enum: ['LINEAR', 'TACTILE', 'CLICKY'] })
  @IsOptional()
  @IsEnum(['LINEAR', 'TACTILE', 'CLICKY'])
  switchType?: string;

  @ApiPropertyOptional({
    enum: ['FULL', 'TKL', 'SEVENTY_FIVE', 'SIXTY_FIVE', 'SIXTY', 'SPLIT'],
  })
  @IsOptional()
  @IsEnum(['FULL', 'TKL', 'SEVENTY_FIVE', 'SIXTY_FIVE', 'SIXTY', 'SPLIT'])
  layout?: string;

  @ApiPropertyOptional({ enum: ['WIRED', 'WIRELESS', 'BLUETOOTH'] })
  @IsOptional()
  @IsEnum(['WIRED', 'WIRELESS', 'BLUETOOTH'])
  connectivity?: string;

  @ApiPropertyOptional({
    enum: ['featured', 'price_asc', 'price_desc', 'newest', 'rating'],
  })
  @IsOptional()
  @IsEnum(['featured', 'price_asc', 'price_desc', 'newest', 'rating'])
  sortBy?: SortBy;
}
