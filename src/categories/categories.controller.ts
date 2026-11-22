import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CategoriesService } from './categories.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { AuthGuard } from '../auth/auth.guard.js';


@Controller('categories')
@UseGuards(AuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto, @Request() request: any) {
    const userId = request.user.sub;
    return this.categoriesService.create(createCategoryDto, userId);
  }

  @Get()
  findAll(@Request() request: any) {
    const userId = request.user.sub;
    return this.categoriesService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() request: any) {
    const userId = request.user.sub;
    return this.categoriesService.findOne(id, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto, @Request() request: any) {
    const userId = request.user.sub;
    return this.categoriesService.update(id, updateCategoryDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() request: any) {
    const userId = request.user.sub;
    return this.categoriesService.remove(id, userId);
  }
}
