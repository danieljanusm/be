import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { CreateRecipeDto } from './input/createRecipe.dto';
import {
  DatabaseRecord,
  PaginatedRecord,
} from '../../common/models/databaseRecord.model';
import { Recipe } from './model/recipe.model';
import { Public } from '../../common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('recipe')
export class RecipeController {
  constructor(private recipeService: RecipeService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/photos',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  createRecipe(
    @UploadedFile() file: Express.Multer.File,
    @Body() createRecipeDto: CreateRecipeDto,
    @Req() req,
  ): Promise<DatabaseRecord<Recipe>> {
    const photoUrl = file ? `/uploads/photos/${file.filename}` : null;
    const { photo, ...recipe } = createRecipeDto;
    recipe.servings = Number(recipe.servings);
    return this.recipeService.createRecipe(recipe, req.user.id, photoUrl);
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
