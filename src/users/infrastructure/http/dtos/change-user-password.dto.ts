import { IsString, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class ChangeUserPasswordDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
    message: 'CPF format is invalid. Expected format: 000.000.000-00',
  })
  cpf!: string;

  @IsString()
  @IsNotEmpty()
  oldPassword!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'The new password must be at least 6 characters long' })
  newPassword!: string;
}