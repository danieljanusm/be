import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { CreateRecipeDto } from './input/createRecipe.dto';
import {
  DatabaseRecord,
  PaginatedRecord,
} from '../../common/models/databaseRecord.model';
import { Recipe } from './model/recipe.model';

@Controller('recipe')
export class RecipeController {
  constructor(private recipeService: RecipeService) {}

  @Post()
  createRecipe(
    @Body() createRecipeDto: CreateRecipeDto,
    @Req() req,
  ): Promise<DatabaseRecord<Recipe>> {
    return this.recipeService.createRecipe(createRecipeDto, req.user.id);
  }

  @Get()
  getRecipes(
    @Query('id') id?: string,
    @Query('authorId') authorId?: string,
    @Query('pageSize') pageSize?: string,
    @Query('page') page?: string,
  ): Promise<
    DatabaseRecord<Recipe> | PaginatedRecord<DatabaseRecord<Recipe>[]>
  > {
    const pageSizeNumber: number = !pageSize
      ? undefined
      : parseInt(pageSize, 10);
    const pageNumber: number = !page ? undefined : parseInt(page, 10);
    if (id) {
      return this.recipeService.getRecipe(id);
    } else if (authorId) {
      return this.recipeService.getRecipesByAuthorId(
        authorId,
        pageSizeNumber,
        pageNumber,
      );
    } else if (pageSize || page) {
      return this.recipeService.getRecipes(pageSizeNumber, pageNumber);
    }
  }
}
