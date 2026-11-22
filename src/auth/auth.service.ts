import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import * as bcrypt from 'bcryptjs';
import { bytes } from 'stream/consumers';
import { CreateLoginDto } from './dto/login-auth.dto.js';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService) {}

  async register(createAuthDto: CreateAuthDto) {
    // 1. Cek apakah email sudah terdaftar di database
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: createAuthDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email sudah terdaftar');
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

  async login(createLoginDto: CreateLoginDto) {
    const isEmailExist = await this.prisma.user.findUnique({
      where: {
        email: createLoginDto.email
      }
    })

    if (!isEmailExist) {
      throw new UnauthorizedException('Email belum terdaftar')
    }

    const isPasswordValid = await bcrypt.compare(
      createLoginDto.password,
      isEmailExist.password
    )

    if(!isPasswordValid) {
      throw new UnauthorizedException('Email atau password salah')
    }

    const payload = { sub: isEmailExist.id, email: isEmailExist.email }
    const accessToken = await this.jwtService.signAsync(payload)

    return {
      id: isEmailExist.id,
      name: isEmailExist.name,
      email: isEmailExist.email,
      accessToken,
    };
}
}