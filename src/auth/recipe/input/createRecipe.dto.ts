import { IsArray, IsInt, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateRecipeDto {
  @IsString()
  name: string;

  @IsString()
  shortDescription: string;

  @IsInt()
  servings: number;

  @IsOptional()
  @IsUrl()
  photoUrl?: string;

  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
