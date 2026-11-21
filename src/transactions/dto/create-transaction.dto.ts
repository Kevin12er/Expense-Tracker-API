import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsInt,
  IsUUID,
  IsPositive,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTransactionDto {
  //Description
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'Deskripsi harus berupa teks' })
  @IsNotEmpty({ message: 'Deskripsi tidak boleh kosong' })
  @MaxLength(100, {
    message: 'Tidak boleh melebihi 100 karakter',
  })
  description: string;

  //amount
  @IsInt({ message: 'Angka harus bilangan bulat' })
  @IsNotEmpty({ message: 'Field tidak boleh kosong' })
  @IsPositive({ message: 'Amount harus lebih besar dari nol' })
  amount: number;

  //categoryId
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'Masukkan id yang valid' })
  @IsNotEmpty({ message: 'Field tidak boleh kosong' })
  @IsUUID('4', {
    message: 'Format categoryId harus berupa UUID v4 yang valid.',
  })
  categoryId: string;

  //accountId
  @IsString({ message: 'Input harus berupa string' })
  @IsNotEmpty({ message: 'Field tidak boleh kosong' })
  @IsUUID('4', {
    message: 'Format accountId harus berupa UUID v4 yang valid',
  })
  accountId: string;

  
}
