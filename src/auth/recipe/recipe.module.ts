import { Module } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { PrismaService } from '../../database/prisma.service';

@Module({
  providers: [RecipeService, PrismaService],
  controllers: [RecipeController],
})
export class RecipeModule {}
