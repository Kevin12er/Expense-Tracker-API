import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(createAuthDto: CreateAuthDto) {
    // 1. Cek apakah email sudah terdaftar di database
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: createAuthDto.email },
    });

    if (existingUser) {
      throw new Error('Email sudah terdaftar');
    }

    // 2. Hash password menggunakan bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createAuthDto.password, saltRounds);

    // 3. Simpan user ke database (password sudah di-hash)
    return this.prisma.user.create({
      data:{
        name: createAuthDto.name,
        email: createAuthDto.email,
        password: hashedPassword,
      },
    });
  }
}