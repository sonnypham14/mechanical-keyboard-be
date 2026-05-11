import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { API_FULL_PREFIX, SWAGGER_PATH } from './common/constants/app.constant';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const isProduction = configService.get<boolean>('app.isProduction');
  // const isStaging = configService.get<boolean>('app.isStaging');
  const port = configService.get<number>('app.port');
  const frontendUrl = configService.get<string>('app.frontendUrl');

  // 1. Global prefix
  app.setGlobalPrefix(API_FULL_PREFIX);

  // 2. CORS
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  // 3. Global pipes — validate và transform request body
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // 4. Global interceptor — format tất cả response thành công
  app.useGlobalInterceptors(
    new ResponseInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  // 5. Global filter — format tất cả response lỗi
  app.useGlobalFilters(new HttpExceptionFilter());

  // 6. Swagger — chỉ bật ở dev và staging
  if (!isProduction) {
    const config = new DocumentBuilder()
      .setTitle('Mechanical Keyboard API')
      .setDescription('API documentation for Mechanical Keyboard Store')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT access token',
        },
        'access-token',
      )
      .addTag('Auth', 'Authentication endpoints')
      .addTag('Users', 'User management')
      .addTag('Products', 'Product catalog')
      .addTag('Categories', 'Product categories')
      .addTag('Brands', 'Product brands')
      .addTag('Orders', 'Order management')
      .addTag('Reviews', 'Product reviews')
      .addTag('Wishlist', 'User wishlist')
      .addTag('Builder', 'Keyboard builder')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(SWAGGER_PATH, app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });

    console.log(`Swagger docs: http://localhost:${port}/${SWAGGER_PATH}`);
  }

  await app.listen(port ?? 3001);
  console.log(
    `[${configService.get('app.nodeEnv')}] Server running on http://localhost:${port}`,
  );
}

void bootstrap();
