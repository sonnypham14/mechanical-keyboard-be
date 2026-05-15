import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig, jwtConfig } from './config';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { BrandsModule } from './modules/brands/brands.module';
import { ProductsModule } from './modules/products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV ?? 'development'}`,
      load: [appConfig, jwtConfig],
      validationOptions: {
        abortEarly: true,
      },
    }),
    PrismaModule,
    CategoriesModule,
    BrandsModule,
    ProductsModule,
  ],
})
export class AppModule {}
