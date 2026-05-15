import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { IUser } from '../../../common/interfaces';
import { IUserRepository } from '../interfaces/user-repository.interface';
import { Role } from '../../../common/constants/app.constant';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<IUser | null> {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
    });
    return user ? this.mapOne(user) : null;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const user = await this.prisma.user.findFirst({
      where: { email, deletedAt: null },
    });
    return user ? this.mapOne(user) : null;
  }

  async findByEmailWithPassword(
    email: string,
  ): Promise<(IUser & { password: string }) | null> {
    const user = await this.prisma.user.findFirst({
      where: { email, deletedAt: null },
    });
    if (!user) return null;
    return { ...this.mapOne(user), password: user.password };
  }

  async create(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<IUser> {
    const user = await this.prisma.user.create({ data });
    return this.mapOne(user);
  }

  private mapOne(user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
    role: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  }): IUser {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      role: user.role as Role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    };
  }
}
