import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateRecipeDto } from './input/createRecipe.dto';
import {
  DatabaseRecord,
  PaginatedRecord,
} from '../../common/models/databaseRecord.model';
import { Recipe } from './model/recipe.model';
import { User } from '../../users/models/user.type';
import { Prisma } from '@prisma/client';
import { validate as isValidUUID } from 'uuid';

@Injectable()
export class RecipeService {
  constructor(private prisma: PrismaService) {}

  public async createRecipe(
    recipe: CreateRecipeDto,
    userId: string,
  ): Promise<DatabaseRecord<Recipe>> {
    const author: DatabaseRecord<User> = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!author) {
      throw new NotFoundException("User not found. Can't create recipe.");
    }

    return this.prisma.recipe.create({
      data: {
        ...recipe,
        rate: new Prisma.Decimal(0),
        rateCount: 0,
        author: { connect: author },
      },
    });
  }

  public async getRecipe(recipeId: string): Promise<DatabaseRecord<Recipe>> {
    if (!recipeId || !isValidUUID(recipeId)) {
      throw new NotFoundException('Provide correct id');
    }

    const recipe: DatabaseRecord<Recipe> = await this.prisma.recipe.findUnique({
      where: { id: recipeId },
    });

    if (!recipe) {
      throw new NotFoundException("Can't find recipe with provided id.");
    }

    return recipe;
  }

  public async getRecipesByAuthorId(
    authorId: string,
    pageSizeNumber: number,
    pageNumber: number,
  ): Promise<PaginatedRecord<DatabaseRecord<Recipe>[]>> {
    if (!authorId || !isValidUUID(authorId)) {
      throw new NotFoundException('Provide correct id');
    }

    const pageSize: number = !!pageSizeNumber ? pageSizeNumber : 10;
    const page: number = pageNumber ?? 0;

    const data: DatabaseRecord<Recipe>[] = await this.prisma.recipe.findMany({
      where: { authorId },
      take: pageSize,
      skip: page * pageSize,
    });

    const totalCount: number = await this.prisma.recipe.count({});
    const totalPages: number = !totalCount
      ? 0
      : Math.ceil(totalCount / pageSize);

    return { data, page, pageSize, totalPages, totalCount };
  }

  public async getRecipes(
    pageSizeNumber: number,
    pageNumber: number,
  ): Promise<PaginatedRecord<DatabaseRecord<Recipe>[]>> {
    const pageSize: number = !!pageSizeNumber ? pageSizeNumber : 10;
    const page: number = pageNumber ?? 0;
    const data: DatabaseRecord<Recipe>[] = await this.prisma.recipe.findMany({
      take: pageSize,
      skip: page * pageSize,
    });
    const totalCount: number = await this.prisma.recipe.count({});
    const totalPages: number = !totalCount
      ? 0
      : Math.ceil(totalCount / pageSize);

    return { data, page, pageSize, totalPages, totalCount };
  }
}
