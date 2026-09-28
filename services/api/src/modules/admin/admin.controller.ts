import {
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';

import { AdminService } from './admin.service';
import { AdminGuard } from './admin.guard';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
  ) {}

  // =========================
  // COLLECTORS
  // =========================

  @Get('collectors')
  getAllCollectors() {
    return this.adminService.getAllCollectors();
  }

  // =========================
  // LOTS
  // =========================

  @Get('lots')
  getAllLots() {
    return this.adminService.getAllLots();
  }

  // =========================
  // PRICE BOARD
  // =========================

  @Get('price-board')
  getAllPriceBoard() {
    return this.adminService.getAllPriceBoard();
  }

  // =========================
  // TRANSACTIONS
  // =========================

  @Get('transactions')
  getAllPayments() {
    return this.adminService.getAllPayments();
  }

  // =========================
  // RECYCLERS
  // =========================

  @Get('recyclers')
  getAllRecyclers() {
    return this.adminService.getAllRecyclers();
  }

  @Get('recyclers/pending')
  getPendingRecyclers() {
    return this.adminService.getPendingRecyclers();
  }

  @Get('recyclers/:id')
  getRecycler(@Param('id') id: string) {
    return this.adminService.getRecycler(id);
  }

  @Patch('recyclers/:id/verify')
  verifyRecycler(@Param('id') id: string) {
    return this.adminService.verifyRecycler(id);
  }

  @Patch('recyclers/:id/reject')
  rejectRecycler(@Param('id') id: string) {
    return this.adminService.rejectRecycler(id);
  }
}