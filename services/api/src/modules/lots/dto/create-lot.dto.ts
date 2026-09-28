import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateLotDto {
  @IsUUID()
  materialCategoryId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  approximateWeight?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedValueLow?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedValueHigh?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  valuationConfidence?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  imageReference?: string;

  @IsDateString()
  collectionTimestamp!: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;
}