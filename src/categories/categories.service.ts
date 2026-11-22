import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';


@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const existingCategory = await this.prisma.category.findUnique({
      where: {
        name: createCategoryDto.name,
      },
    });

    if (existingCategory) {
      throw new ConflictException('Category name already exist');
    }

    return await this.prisma.category.create({
      data: {
        name: createCategoryDto.name,
      },
    });
  }

  findAll(userId: string) {
    return this.prisma.category.findMany({
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: {
        id: id,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const isCategoryExist = await this.prisma.category.findUnique({
      where: {
        id: id,
      },
    });

    if (!isCategoryExist) {
      throw new NotFoundException('Category Not Found');
    }

    return this.prisma.category.update({
      where: {
        id: id,
      },
      data: {
        name: updateCategoryDto.name,
      },
    });
  }

  async remove(id: string) {
    const deleteCategory = await this.prisma.category.findUnique({
      where: {
        id: id,
      },
    });

    if (!deleteCategory) {
      throw new NotFoundException('Category Not Found');
    }

    return this.prisma.category.delete({
      where: {
        id: id,
      },
    });
  }
}
