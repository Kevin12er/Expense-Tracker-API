import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto.js';
import { UpdateTransactionDto } from './dto/update-transaction.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const isCategoryExist = await this.prisma.category.findUnique({
      where: {
        id: createTransactionDto.categoryId,
      },
    });

    if (!isCategoryExist) {
      throw new NotFoundException('Kategori tidak ditemukan');
    }

    return await this.prisma.transaction.create({
      data: {
        description: createTransactionDto.description,
        amount: createTransactionDto.amount,
        categoryId: createTransactionDto.categoryId,
      },
    });
  }

  findAll() {
    return `This action returns all transactions`;
  }

  findOne(id: string) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
