import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
import { Public } from '../../common/decorators';

@Controller('recipe')
export class RecipeController {
  constructor(private recipeService: RecipeService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createRecipe(
    @Body() createRecipeDto: CreateRecipeDto,
    @Req() req,
  ): Promise<DatabaseRecord<Recipe>> {
    return this.recipeService.createRecipe(createRecipeDto, req.user.id);
  }

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
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
