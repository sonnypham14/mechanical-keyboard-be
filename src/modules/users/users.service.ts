import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { IUserRepository } from './interfaces/user-repository.interface';
import { USER_REPOSITORY } from './interfaces/user-repository.interface';
import { IUser } from '../../common/interfaces';
import { UpdateProfileDto, ChangePasswordDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: IUserRepository,
  ) {}

  async findById(id: string): Promise<IUser | null> {
    return this.userRepo.findById(id);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.userRepo.findByEmail(email);
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

  async getProfile(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    return { data: user, message: 'Get profile successfully' };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    const updated = await this.userRepo.update(userId, dto);
    return { data: updated, message: 'Profile updated successfully' };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.userRepo.findByIdWithPassword(userId);
    if (!user) throw new NotFoundException('User not found');

    const isMatch = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isMatch)
      throw new UnauthorizedException('Current password is incorrect');

    const hashed = await bcrypt.hash(dto.newPassword, 10);
    await this.userRepo.update(userId, { password: hashed });
    return { data: null, message: 'Password changed successfully' };
  }
}
