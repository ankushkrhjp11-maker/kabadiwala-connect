import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';

import { PassportService } from './passport.service';

@Controller('passports')
export class PassportController {
  constructor(
    private readonly passportService: PassportService,
  ) {}

  // Public token route MUST come first
  @Get('public/:publicToken')
  getPassportByToken(
    @Param('publicToken')
    publicToken: string,
  ) {
    return this.passportService.getPassportByToken(
      publicToken,
    );
  }

  // Passport code route
  @Get(':passportCode')
  getPublicPassport(
    @Param('passportCode')
    passportCode: string,
  ) {
    return this.passportService.getPublicPassport(
      passportCode,
    );
  }
}