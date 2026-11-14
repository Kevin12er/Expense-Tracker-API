import { IsString, IsNotEmpty } from 'class-validator';


export class CreateCategoryDto {
    @IsString({ message: 'Nama harus berupa teks'})
    @IsNotEmpty({ message: 'Nama tidak boleh kosong'})

    name: string;
}
