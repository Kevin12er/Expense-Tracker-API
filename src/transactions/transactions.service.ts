import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto.js';
import { UpdateTransactionDto } from './dto/update-transaction.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { connect } from 'node:http2';
import { Prisma } from '../generated/prisma/client.js';

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
        category: {
          connect: {
            id: createTransactionDto.categoryId,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.transaction.findMany({
      include: {
        category: true,
      },
    });
  }

  async findOne(id: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transaksi tidak ditemukan');
    }

    return transaction;
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto) {
    const findData = await this.prisma.transaction.findUnique({
      where: {
        id,
      },
    });

    if (!findData) {
      throw new NotFoundException('Transaksi tidak ditemukan');
    }

    const { categoryId, ...transactionData } = updateTransactionDto;

    const data: Prisma.TransactionUpdateInput = {
      ...transactionData,
    };

    if (categoryId !== undefined) {
      const isCategoryExist = await this.prisma.category.findUnique({
        where: {
          id: categoryId,
        },
      });

      if (!isCategoryExist) {
        throw new NotFoundException('Kategori tidak ditemukan');
      }

      data.category = {
        connect: {
          id: categoryId,
        },
      };
    }

    return this.prisma.transaction.update({
      where: {
        id,
      },
      data,
    });
  }

  async remove(id: string) {
    const removeTransaction = await this.prisma.transaction.findUnique({
      where: { id },
    });

    if (!removeTransaction) {
      throw new NotFoundException('Transaksi tidak ditemukan');
    }

    return this.prisma.transaction.delete({
      where: { id: id },
    });
  }
}
