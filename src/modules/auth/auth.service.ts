import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../../prisma/prisma.service';
import type { StringValue } from 'ms';
import { RegisterDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { IUser } from '../../common/interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.usersService.findByEmail(dto.email);
    if (exists) throw new BadRequestException('Email already in use');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      ...dto,
      password: hashedPassword,
    });

    const tokens = await this.generateTokens(user);
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return {
      data: { user: this.sanitize(user), ...tokens },
      message: 'Registered successfully',
    };
  }

  async login(user: IUser) {
    const tokens = await this.generateTokens(user);
    await this.saveRefreshToken(user.id, tokens.refreshToken);
    return {
      data: { user: this.sanitize(user), ...tokens },
      message: 'Logged in successfully',
    };
  }

  async logout(userId: string) {
    await this.prisma.refreshToken.deleteMany({ where: { userId } });
    return { data: null, message: 'Logged out successfully' };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const record = await this.prisma.refreshToken.findFirst({
      where: { userId, expiresAt: { gt: new Date() } },
    });
    if (!record) throw new UnauthorizedException('Invalid refresh token');

    const isMatch = await bcrypt.compare(refreshToken, record.token);
    if (!isMatch) throw new UnauthorizedException('Invalid refresh token');

    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');

    const tokens = await this.generateTokens(user);
    await this.prisma.refreshToken.delete({ where: { id: record.id } });
    await this.saveRefreshToken(userId, tokens.refreshToken);

    return { data: tokens, message: 'Tokens refreshed successfully' };
  }

  async validateUser(email: string, password: string): Promise<IUser | null> {
    const user = await this.usersService.findByEmailWithPassword(email);
    if (!user) return null;
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;
    return user;
  }

  private async generateTokens(user: IUser) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.accessSecret'),
        expiresIn: this.configService.get<StringValue>('jwt.accessExpiresIn'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
        expiresIn: this.configService.get<StringValue>('jwt.refreshExpiresIn'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async saveRefreshToken(userId: string, token: string) {
    const hashed = await bcrypt.hash(token, 10);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await this.prisma.refreshToken.create({
      data: { userId, token: hashed, expiresAt },
    });
  }

  private sanitize(user: IUser) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
  }
}
