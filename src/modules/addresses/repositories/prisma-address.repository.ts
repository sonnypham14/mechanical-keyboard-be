import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { IAddress } from '../../../common/interfaces';
import { CreateAddressDto, UpdateAddressDto } from '../dto';
import { IAddressRepository } from '../interfaces/address-repository.interface';

@Injectable()
export class PrismaAddressRepository implements IAddressRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: string): Promise<IAddress[]> {
    const addresses = await this.prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
    return addresses.map((a) => this.mapOne(a));
  }

  async findById(id: string): Promise<IAddress | null> {
    const address = await this.prisma.address.findUnique({ where: { id } });
    return address ? this.mapOne(address) : null;
  }

  async create(userId: string, dto: CreateAddressDto): Promise<IAddress> {
    const address = await this.prisma.$transaction(async (tx) => {
      if (dto.isDefault) {
        await tx.address.updateMany({
          where: { userId },
          data: { isDefault: false },
        });
      }
      return tx.address.create({ data: { ...dto, userId } });
    });
    return this.mapOne(address);
  }

  async update(id: string, dto: UpdateAddressDto): Promise<IAddress> {
    const address = await this.prisma.address.update({
      where: { id },
      data: dto,
    });
    return this.mapOne(address);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.address.delete({ where: { id } });
  }

  async setDefault(userId: string, addressId: string): Promise<IAddress> {
    const address = await this.prisma.$transaction(async (tx) => {
      await tx.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
      return tx.address.update({
        where: { id: addressId },
        data: { isDefault: true },
      });
    });
    return this.mapOne(address);
  }

  private mapOne(address: {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    city: string;
    state: string | null;
    country: string;
    zipCode: string;
    isDefault: boolean;
  }): IAddress {
    return {
      id: address.id,
      userId: address.userId,
      firstName: address.firstName,
      lastName: address.lastName,
      phone: address.phone,
      address: address.address,
      city: address.city,
      state: address.state,
      country: address.country,
      zipCode: address.zipCode,
      isDefault: address.isDefault,
    };
  }
}
