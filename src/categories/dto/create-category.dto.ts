import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';


export class CreateCategoryDto {
    @Transform(({ value }) => (typeof value === 'string' ? value.trim(): value))
    @IsString({ message: 'Nama harus berupa teks'})
    @IsNotEmpty({ message: 'Nama tidak boleh kosong'})
    @MaxLength(20,{
        message: 'Nama terlalu panjang'
    })
    name: string;   
}
