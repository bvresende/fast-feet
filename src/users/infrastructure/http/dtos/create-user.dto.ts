import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
    message: 'CPF format is invalid. Expected format: 000.000.000-00',
  })
  cpf!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}
