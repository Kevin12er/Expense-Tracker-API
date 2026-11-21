import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateAuthDto {
  @Transform(({value}) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty({message: 'Field tidak boleh kosong'})
  @IsString({ message: 'Masukkan nama yang valid' })
  name: string;


  @IsEmail({}, { message: 'Masukkan email yang valid' })
  @IsNotEmpty({ message: 'Email tidak boleh kosong' })
  email: string;

  @IsString({ message: 'Password harus berupa teks' })
  @IsNotEmpty({ message: 'Password tidak boleh kosong' })
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  password: string;
}