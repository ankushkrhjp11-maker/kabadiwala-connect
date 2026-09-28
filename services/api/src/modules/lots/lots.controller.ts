import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { LotsService } from './lots.service';
import { CreateLotDto } from './dto/create-lot.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/guards/jwt-auth.guard';

@Controller('lots')
export class LotsController {
  constructor(
    private readonly lotsService: LotsService,
  ) {}

  // =========================================================
  // CREATE LOT
  // =========================================================

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Req() request: AuthenticatedRequest,
    @Body() dto: CreateLotDto,
  ) {
    return this.lotsService.create(
      request.user!.sub,
      dto,
    );
  }

  // =========================================================
  // CONFIRM HANDOVER
  // =========================================================

  @Patch(':id/handover')
  @UseGuards(JwtAuthGuard)
  confirmHandover(
    @Req() request: AuthenticatedRequest,
    @Param('id') lotId: string,
  ) {
    return this.lotsService.confirmHandover(
      lotId,
      request.user!.sub,
    );
  }

  // =========================================================
  // CONFIRM RECEIVED BY RECYCLER
  // =========================================================

  @Patch(':id/recycler-received')
  @UseGuards(JwtAuthGuard)
  confirmRecyclerReceived(
    @Req() request: AuthenticatedRequest,
    @Param('id') lotId: string,
  ) {
    return this.lotsService.confirmRecyclerReceived(
      lotId,
      request.user!.sub,
    );
  }
}