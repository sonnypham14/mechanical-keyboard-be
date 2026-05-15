import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBrandDto {
  @ApiProperty({ example: 'Keychron' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'keychron' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiPropertyOptional({ example: 'https://example.com/logo.png' })
  @IsOptional()
  @IsUrl()
  logo?: string;

  @ApiPropertyOptional({ example: 'https://keychron.com' })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({ example: 'Hong Kong' })
  @IsOptional()
  @IsString()
  country?: string;
}
