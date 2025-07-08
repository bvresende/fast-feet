import { IsString, IsNotEmpty, IsUrl } from 'class-validator';

export class DeliverPackageDto {
  @IsUrl({}, { message: 'A URL da foto é inválida' })
  @IsString()
  @IsNotEmpty()
  photoUrl!: string;
}