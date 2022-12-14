import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoryClassification } from './category-classification.enum';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get('/:classification')
  async getAllCategories(
    @Param('classification') classification: CategoryClassification,
  ): Promise<Category[]> {
    const data = await this.categoriesService.getCategoriesByClassification(
      classification,
    );
    return Object.assign({
      statusCode: 200,
      message: `${classification} 카테고리 목록 조회 성공`,
      data,
    });
  }

  @Post('/')
  async createStation(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const data = await this.categoriesService.createCategory(createCategoryDto);
    return Object.assign({
      statusCode: 201,
      message: `카테고리 등록 성공`,
      data,
    });
  }

  @Patch('/:id')
  async updateStation(
    @Param('id', ParseIntPipe) id: number,
    @Body() category: Category,
  ): Promise<Category> {
    const data = await this.categoriesService.updateCategory(id, category);
    return Object.assign({
      statusCode: 200,
      message: `카테고리 수정 성공`,
      data,
    });
  }

  @Delete('/:id')
  deleteStation(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.categoriesService.deleteCategory(id);
  }
}
