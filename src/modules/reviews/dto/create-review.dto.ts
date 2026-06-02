import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ example: 'clxyz123' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ example: 'Bàn phím tuyệt vời' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: 'Switch rất mượt, tiếng gõ nghe hay...' })
  @IsString()
  @IsNotEmpty()
  body: string;
}
