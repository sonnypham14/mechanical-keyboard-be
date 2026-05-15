import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PrismaProductRepository } from './repositories/prisma-product.repository';
import { PrismaModule } from '../../prisma/prisma.module';
import { PRODUCT_REPOSITORY } from './interfaces/product-repository.interface';

@Module({
  imports: [PrismaModule],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    {
      provide: PRODUCT_REPOSITORY,
      useClass: PrismaProductRepository,
    },
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
