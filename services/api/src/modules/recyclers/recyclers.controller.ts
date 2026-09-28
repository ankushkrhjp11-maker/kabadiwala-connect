import {
  Body,
  Controller,
  Get,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';

import { RecyclersService } from './recyclers.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/guards/jwt-auth.guard';

@Controller('recyclers')
@UseGuards(JwtAuthGuard)
export class RecyclersController {
  constructor(
    private readonly recyclersService: RecyclersService,
  ) {}

  @Get('lots')
  getAvailableLots(
    @Req() request: AuthenticatedRequest,
  ) {
    return this.recyclersService.getAvailableLots(
      request.user!.sub,
    );
  }

  @Get('me')
  getMyProfile(
    @Req() request: AuthenticatedRequest,
  ) {
    return this.recyclersService.getMyProfile(
      request.user!.sub,
    );
  }

  @Put('me/create')
  createProfile(
    @Req() request: AuthenticatedRequest,
    @Body()
    body: {
      businessName: string;
      facilityAddress: string;
      latitude?: number;
      longitude?: number;
      authorizationNumber?: string;
      acceptedMaterials: string[];
      serviceArea: string[];
      pickupAvailable?: boolean;
    },
  ) {
    return this.recyclersService.createProfile(
      request.user!.sub,
      body,
    );
  }

  @Put('me')
  updateProfile(
    @Req() request: AuthenticatedRequest,
    @Body()
    body: {
      businessName?: string;
      facilityAddress?: string;
      latitude?: number;
      longitude?: number;
      authorizationNumber?: string;
      acceptedMaterials?: string[];
      serviceArea?: string[];
      pickupAvailable?: boolean;
    },
  ) {
    return this.recyclersService.updateProfile(
      request.user!.sub,
      body,
    );
  }
}