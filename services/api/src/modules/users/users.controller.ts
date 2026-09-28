import {
  Body,
  Controller,
  Get,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from './users.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get('me/profile')
  getMyProfile(
    @Req() request: AuthenticatedRequest,
  ) {
    return this.usersService.getMyProfile(
      request.user!.sub,
    );
  }

  @Put('me/profile')
  updateMyProfile(
    @Req() request: AuthenticatedRequest,
    @Body()
    body: {
      name: string;
      email: string;
      dateOfBirth: string;
      businessRole:
        | 'RECYCLER'
        | 'TRADER'
        | 'MANUFACTURER';
      profileImageReference?: string;
    },
  ) {
    return this.usersService.updateMyProfile(
      request.user!.sub,
      body,
    );
  }

  @Get('me/collector-profile')
  getCollectorProfile(
    @Req() request: AuthenticatedRequest,
  ) {
    return this.usersService.getCollectorProfile(
      request.user!.sub,
    );
  }

  @Put('me/collector-profile')
  updateCollectorProfile(
    @Req() request: AuthenticatedRequest,
    @Body()
    body: {
      address?: string;
      locationDescription?: string;
      latitude?: number;
      longitude?: number;
    },
  ) {
    return this.usersService.updateCollectorProfile(
      request.user!.sub,
      body,
    );
  }

  @Put('me/collector-profile/create')
  createCollectorProfile(
    @Req() request: AuthenticatedRequest,
    @Body()
    body: {
      address?: string;
      locationDescription?: string;
      latitude?: number;
      longitude?: number;
    },
  ) {
    return this.usersService.createCollectorProfile(
      request.user!.sub,
      body,
    );
  }
}