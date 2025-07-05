import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreatePackageDto {
  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsUUID()
  @IsNotEmpty()
  recipientId!: string;
}