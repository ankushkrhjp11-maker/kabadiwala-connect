import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { PrismaService } from '../../../prisma/prisma.service';

import { AdminLoginDto } from './dto/admin-login.dto';

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: AdminLoginDto) {
    const identifier = dto.identifier.trim();

    if (!identifier) {
      throw new UnauthorizedException(
        'Email or phone is required',
      );
    }

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            email: identifier,
          },
          {
            phone: identifier.replace(/\D/g, ''),
          },
        ],
      },
    });

    if (!user) {
      throw new UnauthorizedException(
        'Invalid email/phone or password',
      );
    }

    if (user.role !== 'ADMIN') {
      throw new UnauthorizedException(
        'Admin access required',
      );
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        'Admin account is inactive',
      );
    }

    if (!user.passwordHash) {
      throw new UnauthorizedException(
        'Admin password is not configured',
      );
    }

    const passwordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!passwordValid) {
      throw new UnauthorizedException(
        'Invalid email/phone or password',
      );
    }

    const accessToken =
      await this.jwtService.signAsync({
        sub: user.id,
        role: user.role,
        type: 'access',
      });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      accessToken,
    };
  }
}