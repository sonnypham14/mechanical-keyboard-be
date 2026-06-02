import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ADDRESS_REPOSITORY } from './interfaces/address-repository.interface';
import type { IAddressRepository } from './interfaces/address-repository.interface';
import { CreateAddressDto, UpdateAddressDto } from './dto';

@Injectable()
export class AddressesService {
  constructor(
    @Inject(ADDRESS_REPOSITORY)
    private readonly addressRepo: IAddressRepository,
  ) {}

  async findMyAddresses(userId: string) {
    const addresses = await this.addressRepo.findByUserId(userId);
    return { data: addresses, message: 'Get addresses successfully' };
  }

  async create(userId: string, dto: CreateAddressDto) {
    const address = await this.addressRepo.create(userId, dto);
    return { data: address, message: 'Address created successfully' };
  }

  async update(id: string, userId: string, dto: UpdateAddressDto) {
    const address = await this.addressRepo.findById(id);
    if (!address) throw new NotFoundException('Address not found');
    if (address.userId !== userId) throw new ForbiddenException();

    const updated = await this.addressRepo.update(id, dto);
    return { data: updated, message: 'Address updated successfully' };
  }

  async remove(id: string, userId: string) {
    const address = await this.addressRepo.findById(id);
    if (!address) throw new NotFoundException('Address not found');
    if (address.userId !== userId) throw new ForbiddenException();

    await this.addressRepo.delete(id);
    return { data: null, message: 'Address deleted successfully' };
  }

  async setDefault(id: string, userId: string) {
    const address = await this.addressRepo.findById(id);
    if (!address) throw new NotFoundException('Address not found');
    if (address.userId !== userId) throw new ForbiddenException();

    const updated = await this.addressRepo.setDefault(userId, id);
    return { data: updated, message: 'Default address updated successfully' };
  }
}
