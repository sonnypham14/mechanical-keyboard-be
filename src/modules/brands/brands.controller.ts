import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BrandsService } from './brands.service';
import { CreateBrandDto, UpdateBrandDto } from './dto';
import { PaginationDto } from '../../common/dto';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Brands')
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all brands' })
  findAll(@Query() query: PaginationDto) {
    return this.brandsService.findAll(query);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get brand by id' })
  findOne(@Param('id') id: string) {
    return this.brandsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create brand' })
  create(@Body() dto: CreateBrandDto) {
    return this.brandsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update brand' })
  update(@Param('id') id: string, @Body() dto: UpdateBrandDto) {
    return this.brandsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete brand' })
  remove(@Param('id') id: string) {
    return this.brandsService.remove(id);
  }
}
