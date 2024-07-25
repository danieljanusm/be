import { IsArray, IsNumberString, IsOptional, IsString } from 'class-validator';

export class CreateRecipeDto {
  @IsString()
  name: string;

  @IsString()
  shortDescription: string;

  @IsNumberString()
  servings: number;

  @IsOptional()
  photo?: string;

  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
