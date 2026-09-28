import {
  BadRequestException,
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('validate-image')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 8 * 1024 * 1024 },
    }),
  )
  validateImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { selected_category?: string },
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    return this.aiService.validateImage(file, body?.selected_category ?? '');
  }
}
