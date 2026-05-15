import { Module } from '@nestjs/common';
import { BrandsController } from './brands.controller';
import { BrandsService } from './brands.service';
import { PrismaBrandRepository } from './repositories/prisma-brand.repository';
import { BRAND_REPOSITORY } from './interfaces/brand-repository.interface';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BrandsController],
  providers: [
    BrandsService,
    {
      provide: BRAND_REPOSITORY,
      useClass: PrismaBrandRepository,
    },
  ],
  exports: [BrandsService],
})
export class BrandsModule {}
