import type { IUser } from '../../../common/interfaces/entities/user.interface';
import type { UpdateProfileDto } from '../dto/update-profile.dto';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface IUserRepository {
  findById(id: string): Promise<IUser | null>;
  findByIdWithPassword(
    id: string,
  ): Promise<(IUser & { password: string }) | null>;
  findByEmail(email: string): Promise<IUser | null>;
  findByEmailWithPassword(
    email: string,
  ): Promise<(IUser & { password: string }) | null>;
  create(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<IUser>;
  update(
    id: string,
    data: UpdateProfileDto & { password?: string },
  ): Promise<IUser>;
}
