import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaUserRepository } from './repositories/prisma-user.repository';
import { PrismaModule } from '../../prisma/prisma.module';
import { USER_REPOSITORY } from './interfaces/user-repository.interface';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
