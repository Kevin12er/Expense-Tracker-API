import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto.js';
import { UpdateAccountDto } from './dto/update-account.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AccountService {
  constructor(private readonly prisma: PrismaService) {}

  // Create
    // [MODIFIED] Accept userId parameter and connect user relation to Prisma
    async create(createAccountDto: CreateAccountDto, userId: string) {
      return await this.prisma.account.create({
        data: {
          name: createAccountDto.name,
          accountNumber: createAccountDto.accountNumber,
          type: createAccountDto.type,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
    }

  // findall
  async findAll(userId: string) {
    return this.prisma.account.findMany({
      where: {
        userId: userId
      }
    })
  }

  // find one or spesific using id
  async findOne(id: string, userId: string) {
    const existingAccount = await this.prisma.account.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingAccount) {
      throw new NotFoundException('Account Id Not Found');
    }

    return existingAccount;
  }

  //update
  async update(id: string, updateAccountDto: UpdateAccountDto, userId: string) {
    // 1. Cukup panggil findOne. Kalau tidak ada, otomatis error tertangkap di sini!
    await this.findOne(id, userId);

    // 2. Kalau lolos, langsung update datanya
    return this.prisma.account.update({
      where: { id },
      data: {
        name: updateAccountDto.name,
      },
    });
  }

  //delete
  async remove(id: string, userId: string) {
    
    await this.findOne(id, userId);

   
    return this.prisma.account.delete({
      where: { id },
    });
  }
}
