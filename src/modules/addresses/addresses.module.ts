import { Module } from '@nestjs/common';
import { AddressesController } from './addresses.controller';
import { AddressesService } from './addresses.service';
import { PrismaAddressRepository } from './repositories/prisma-address.repository';
import { ADDRESS_REPOSITORY } from './interfaces/address-repository.interface';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AddressesController],
  providers: [
    AddressesService,
    { provide: ADDRESS_REPOSITORY, useClass: PrismaAddressRepository },
  ],
  exports: [AddressesService],
})
export class AddressesModule {}
