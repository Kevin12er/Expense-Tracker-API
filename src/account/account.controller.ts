import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AccountService } from './account.service.js';
import { CreateAccountDto } from './dto/create-account.dto.js';
import { UpdateAccountDto } from './dto/update-account.dto.js';
import { AuthGuard } from '../auth/auth.guard.js';

@Controller('account')
@UseGuards(AuthGuard)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  // [MODIFIED] Add @Request() to extract userId from JWT token
  create(@Body() createAccountDto: CreateAccountDto, @Request() request: any) {
    const userId = request.user.sub;
    return this.accountService.create(createAccountDto, userId);
  }

  @Get()
  findAll(@Request() request: any) {
    const userId = request.user.sub;
    return this.accountService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() request: any) {
    const userId = request.user.sub;
    return this.accountService.findOne(id, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto, @Request() request: any) {
    const userId = request.user.sub;
    return this.accountService.update(id, updateAccountDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() request: any) {
    const userId = request.user.sub;
    return this.accountService.remove(id, userId);
  }
}
