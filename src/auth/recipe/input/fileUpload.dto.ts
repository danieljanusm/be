import { IsInt, IsOptional, IsString } from 'class-validator';

export class FileUploadDto {
  @IsOptional()
  @IsString()
  originalname: string;

  @IsOptional()
  @IsString()
  mimetype: string;

  @IsOptional()
  @IsInt()
  size: number;
}
