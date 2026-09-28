import { Matches } from 'class-validator';

export class LoginDto {
  @Matches(/^[0-9]{10,15}$/, {
    message: 'Phone must contain 10 to 15 digits',
  })
  phone!: string;
}
