import {
  IsIn,
  IsString,
  Matches,
  MaxLength,
  ValidateIf,
} from 'class-validator';

export class RegisterDto {
  @Matches(/^[0-9]{10,15}$/, {
    message: 'Phone must contain 10 to 15 digits',
  })
  phone!: string;

  @IsString()
  @MaxLength(120)
  name!: string;

  @IsIn(['COLLECTOR', 'RECYCLER'])
  role!: 'COLLECTOR' | 'RECYCLER';

  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsIn(['RECYCLER', 'TRADER', 'MANUFACTURER'])
  businessRole?:
    | 'RECYCLER'
    | 'TRADER'
    | 'MANUFACTURER'
    | null;
}