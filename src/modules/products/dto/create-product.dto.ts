import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import type {
  SwitchType,
  Connectivity,
  Layout,
} from '../../../common/interfaces/entities/product.interface';

export class CreateProductDto {
  @ApiProperty({ example: 'Keychron K2 V2' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'keychron-k2-v2' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'KEY-K2-V2-001' })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ example: 'A compact 75% wireless mechanical keyboard.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 89.99 })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiPropertyOptional({ example: 99.99 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  compareAtPrice?: number;

  @ApiProperty({ example: 'https://example.com/thumbnail.jpg' })
  @IsString()
  @IsNotEmpty()
  thumbnail: string;

  @ApiProperty({ example: 'brand-id-here' })
  @IsString()
  @IsNotEmpty()
  brandId: string;

  @ApiProperty({ example: 'category-id-here' })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiPropertyOptional({ enum: ['LINEAR', 'TACTILE', 'CLICKY'] })
  @IsOptional()
  @IsEnum(['LINEAR', 'TACTILE', 'CLICKY'])
  switchType?: SwitchType;

  @ApiPropertyOptional({
    enum: ['FULL', 'TKL', 'SEVENTY_FIVE', 'SIXTY_FIVE', 'SIXTY', 'SPLIT'],
  })
  @IsOptional()
  @IsEnum(['FULL', 'TKL', 'SEVENTY_FIVE', 'SIXTY_FIVE', 'SIXTY', 'SPLIT'])
  layout?: Layout;

  @ApiPropertyOptional({ enum: ['WIRED', 'WIRELESS', 'BLUETOOTH'] })
  @IsOptional()
  @IsEnum(['WIRED', 'WIRELESS', 'BLUETOOTH'])
  connectivity?: Connectivity;

  @ApiPropertyOptional({ example: ['Black', 'White'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  colors?: string[];

  @ApiPropertyOptional({ example: 'Aluminum' })
  @IsOptional()
  @IsString()
  material?: string;

  @ApiPropertyOptional({ example: 1.2 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  weight?: number;

  @ApiPropertyOptional({ example: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stock?: number;

  @ApiPropertyOptional({ example: ['wireless', 'rgb'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;
}
