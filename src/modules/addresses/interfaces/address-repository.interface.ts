import { IAddress } from '../../../common/interfaces';
import { CreateAddressDto, UpdateAddressDto } from '../dto';

export const ADDRESS_REPOSITORY = 'ADDRESS_REPOSITORY';

export interface IAddressRepository {
  findByUserId(userId: string): Promise<IAddress[]>;
  findById(id: string): Promise<IAddress | null>;
  create(userId: string, dto: CreateAddressDto): Promise<IAddress>;
  update(id: string, dto: UpdateAddressDto): Promise<IAddress>;
  delete(id: string): Promise<void>;
  setDefault(userId: string, addressId: string): Promise<IAddress>;
}
