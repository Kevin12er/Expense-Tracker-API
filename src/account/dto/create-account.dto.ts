import { 
    IsString,
    IsNotEmpty,
    MaxLength,
    IsOptional,
    IsIn,
    Matches,
 } from 'class-validator'
 import { Transform } from 'class-transformer'



export class CreateAccountDto {
    //name
    @Transform(({value}) => (typeof value === 'string' ? value.trim() : value))
    @IsString({ message: 'Masukan nama yang valid' })
    @IsNotEmpty({message: 'Field Tidak boleh kosong'})
    @MaxLength(20, {
        message: 'Panjang huruf maksimal 20 karakter'
    })
    name: string

    //accountNumber 
    @IsString({})
    @Matches(/^[0-9]+$/, {
        message: 'accountNumber hanya boleh di isi angka'
    })
    @IsOptional({})
    accountNumber?: string

    // paymenet Method
    @IsString({ message: 'type harus berupa teks' })
    @IsNotEmpty({message: 'Type tidak boleh kosong'})
    @IsIn(['CASH', 'BANK', 'E_WALLET'], {
        message: 'Type harus CASH, BANK, atau E_WALLET'
    })
    type: string
}
