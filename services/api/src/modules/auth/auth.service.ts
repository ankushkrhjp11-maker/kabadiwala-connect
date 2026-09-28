import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserRole } from '../../generated/prisma';
import { PrismaService } from '../../prisma/prisma.service';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

interface TokenPayload {
  sub: string;
  role: UserRole;
  type: 'access' | 'refresh';
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /* =====================================================
     REGISTER
     ===================================================== */

  async register(dto: RegisterDto) {
    const cleanPhone = dto.phone.replace(/\D/g, '');
    const cleanName = dto.name.trim();

    const existingUser =
      await this.prisma.user.findUnique({
        where: {
          phone: cleanPhone,
        },
      });

    if (existingUser) {
      throw new ConflictException(
        'User with this phone already exists',
      );
    }

    /*
     * System role and business role are separate.
     *
     * Recycler:
     *   system role = RECYCLER
     *   business role = RECYCLER
     *
     * Trader:
     *   system role = COLLECTOR
     *   business role = TRADER
     *
     * Manufacturer:
     *   system role = COLLECTOR
     *   business role = MANUFACTURER
     */

    const systemRole =
      dto.businessRole === 'RECYCLER'
        ? UserRole.RECYCLER
        : UserRole.COLLECTOR;

    const user = await this.prisma.user.create({
      data: {
        phone: cleanPhone,
        name: cleanName,
        role: systemRole,
        businessRole: dto.businessRole,
      },
    });

    return this.createAuthResponse(user);
  }

  /* =====================================================
     LOGIN
     ===================================================== */

  async login(dto: LoginDto) {
    const cleanPhone = dto.phone.replace(/\D/g, '');

    /*
     * IMPORTANT:
     *
     * Login NEVER creates an account.
     *
     * If the number exists:
     *   -> Login
     *
     * If the number does not exist:
     *   -> Return error
     *   -> Frontend can send user to registration
     */

    const user = await this.prisma.user.findUnique({
      where: {
        phone: cleanPhone,
      },
    });

    /*
     * Number is not registered.
     */

    if (!user) {
      throw new UnauthorizedException(
        'Account not found. Please register first.',
      );
    }

    /*
     * Account exists but is inactive.
     */

    if (!user.isActive) {
      throw new UnauthorizedException(
        'Account is inactive. Please contact support.',
      );
    }

    /*
     * Existing registered account.
     * Return its real database role and business role.
     */

    return this.createAuthResponse(user);
  }

  /* =====================================================
     REFRESH TOKEN
     ===================================================== */

  async refresh(dto: RefreshTokenDto) {
    try {
      const payload =
        await this.jwtService.verifyAsync<TokenPayload>(
          dto.refreshToken,
        );

      /*
       * Refresh token must have type = refresh.
       */

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException(
          'Invalid refresh token',
        );
      }

      /*
       * Find the user from database.
       */

      const user = await this.prisma.user.findUnique({
        where: {
          id: payload.sub,
        },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException(
          'User not found or inactive',
        );
      }

      /*
       * Generate fresh tokens.
       */

      return this.createAuthResponse(user);
    } catch {
      throw new UnauthorizedException(
        'Invalid or expired refresh token',
      );
    }
  }

  /* =====================================================
     CREATE AUTH RESPONSE
     ===================================================== */

  private async createAuthResponse(user: {
    id: string;
    phone: string;
    name: string | null;
    role: UserRole;
    businessRole:
      | 'RECYCLER'
      | 'TRADER'
      | 'MANUFACTURER'
      | null;
  }) {
    /*
     * ACCESS TOKEN
     */

    const accessToken =
      await this.jwtService.signAsync({
        sub: user.id,
        role: user.role,
        type: 'access',
      });

    /*
     * REFRESH TOKEN
     */

    const refreshToken =
      await this.jwtService.signAsync(
        {
          sub: user.id,
          role: user.role,
          type: 'refresh',
        },
        {
          expiresIn: 604800,
        },
      );

    /*
     * Return complete authenticated user.
     */

    return {
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role,
        businessRole: user.businessRole ?? null,
      },

      accessToken,

      refreshToken,
    };
  }
}