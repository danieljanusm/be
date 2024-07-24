import { Module } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { PrismaService } from '../../database/prisma.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads/photos',
    }),
  ],
  providers: [RecipeService, PrismaService],
  controllers: [RecipeController],
})
export class RecipeModule {}
