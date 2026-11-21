import { 
    IsString,
    IsNotEmpty,
    IsEmail
 } from 'class-validator'
import { Transform } from "class-transformer";

export class CreateLoginDto {
    @Transform(({value}) => (typeof value === 'string' ? value.trim() : value))
    @IsNotEmpty({message: 'Email tidak boleh kosong'})
    @IsString({message: 'Email tidak valid'})
    @IsEmail({})
    email: string


   
    @IsNotEmpty({message: 'Password tidak boleh kosong'})
    @IsString({message: 'Masukkan password yang valid'})
    password: string
}