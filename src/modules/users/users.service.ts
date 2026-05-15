import { Injectable } from '@nestjs/common';
import type { IUserRepository } from './interfaces/user-repository.interface';
import { IUser } from '../../common/interfaces';

@Injectable()
export class UsersService {
  constructor(private readonly userRepo: IUserRepository) {}

  async findById(id: string): Promise<IUser | null> {
    return this.userRepo.findById(id);
  }

  async findByEmail(id: string): Promise<IUser | null> {
    return this.userRepo.findByEmail(id);
  }

  async findByEmailWithPassword(
    email: string,
  ): Promise<(IUser & { password: string }) | null> {
    return this.userRepo.findByEmailWithPassword(email);
  }

  async create(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<IUser> {
    return this.userRepo.create(data);
  }
}
