import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { TransactionsService } from './transactions.service.js';
import { CreateTransactionDto } from './dto/create-transaction.dto.js';
import { UpdateTransactionDto } from './dto/update-transaction.dto.js';
import { AuthGuard } from '../auth/auth.guard.js';

@Controller('transactions')
@UseGuards(AuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  // [MODIFIED] Add @Request() to extract userId from JWT token
  create(@Body() createTransactionDto: CreateTransactionDto, @Request() request: any) {
    const userId = request.user.sub;
    return this.transactionsService.create(createTransactionDto, userId);
  }

  @Get()
  findAll(@Request() request: any) {
    const userId = request.user.sub;
    return this.transactionsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() request: any) {
    const userId = request.user.sub;
    return this.transactionsService.findOne(id, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto, @Request() request: any) {
    const userId = request.user.sub;
    return this.transactionsService.update(id, updateTransactionDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() request: any) {
    const userId = request.user.sub;
    return this.transactionsService.remove(id, userId);
  }
}
