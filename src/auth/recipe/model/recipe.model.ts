import {
  IsArray,
  IsDecimal,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';
import { User } from '@prisma/client';

export class Recipe {
  @IsUUID()
  id: string;

  @IsString()
  authorId: string;

  @IsDecimal()
  rate: any;

  @IsString()
  name: string;

  @IsString()
  shortDescription: string;

  @IsInt()
  rateCount: number;

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

  author?: User;
}
