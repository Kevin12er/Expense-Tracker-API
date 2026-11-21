import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto.js';
import { UpdateAccountDto } from './dto/update-account.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';


@Injectable()
export class AccountService {

  constructor(private readonly prisma: PrismaService) {}

  create(createAccountDto: CreateAccountDto) {
    return this.prisma.account.create({
      data: {
          name: createAccountDto.name,
          accountNumber: createAccountDto.accountNumber,
          type: createAccountDto.type,
      }
    })
  }

  findAll() {
    return `This action returns all account`;
  }

  findOne(id: number) {
    return `This action returns a #${id} account`;
  }

  update(id: number, updateAccountDto: UpdateAccountDto) {
    return `This action updates a #${id} account`;
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }
}
