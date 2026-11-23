import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateTransactionDto } from './dto/create-transaction.dto.js';
import { UpdateTransactionDto } from './dto/update-transaction.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '../generated/prisma/client.js';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  // CREATE
  // [MODIFIED] Accept userId parameter and connect user relation to Prisma
  async create(createTransactionDto: CreateTransactionDto, userId: string) {
    // 1. Periksa apakah Category tersedia
    const isCategoryExist = await this.prisma.category.findUnique({
      where: {
        id: createTransactionDto.categoryId,
        userId: userId,
      },
    });

    // 2. Periksa apakah Account tersedia
    const isAccountExist = await this.prisma.account.findUnique({
      where: {
        id: createTransactionDto.accountId,
      },
    });

    // 3. Tolak jika Category tidak ditemukan
    if (!isCategoryExist) {
      throw new NotFoundException('Kategori tidak ditemukan');
    }

    // 4. Tolak jika Account tidak ditemukan
    if (!isAccountExist) {
      throw new NotFoundException('Account tidak ditemukan');
    }

    // 5. Simpan Transaction sekaligus hubungkan relasinya
    return this.prisma.transaction.create({
      data: {
        description: createTransactionDto.description,
        amount: createTransactionDto.amount,
        category: {
          connect: {
            id: createTransactionDto.categoryId,
          },
        },
        account: {
          connect: {
            id: createTransactionDto.accountId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  // FIND ALL
  async findAll(userId: string) {
    return this.prisma.transaction.findMany({
      include: {
        category: true,
        account: true,
      },
      where: {
        userId: userId,
      },
    });
  }

  // FIND ONE
  async findOne(id: string, userId: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        category: true,
        account: true,
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transaksi tidak ditemukan');
    }

    return transaction;
  }

  // UPDATE
  async update(
    id: string,
    updateTransactionDto: UpdateTransactionDto,
    userId: string,
  ) {
    // 1. Periksa apakah Transaction tersedia
    await this.findOne(id, userId);

    // 2. Pisahkan ID relasi dari data biasa
    const { categoryId, accountId, ...transactionData } = updateTransactionDto;

    // 3. Siapkan data yang akan di-update
    const data: Prisma.TransactionUpdateInput = {
      ...transactionData,
    };

    // 4. Jika Category ID dikirim, validasi dan hubungkan
    if (categoryId !== undefined) {
      const isCategoryExist = await this.prisma.category.findFirst({
        where: {
          id: categoryId,
          userId: userId,
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

    // 5. Jika Account ID dikirim, validasi dan hubungkan
    if (accountId !== undefined) {
      const isAccountExist = await this.prisma.account.findFirst({
        where: {
          id: accountId,
        },
      });

      if (!isAccountExist) {
        throw new NotFoundException('Account tidak ditemukan');
      }

      data.account = {
        connect: {
          id: accountId,
        },
      };
    }

    // 6. Jalankan update
    return this.prisma.transaction.update({
      where: {
        id,
        userId,
      },
      data,
    });
  }

  // REMOVE
  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    return this.prisma.transaction.delete({
      where: {
        id,
        userId,
      },
    });
  }
}
