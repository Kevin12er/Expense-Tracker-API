# Dokumentasi Expense Tracker API

## 1. Tentang Proyek

Expense Tracker API adalah REST API berbasis NestJS (TypeScript) untuk mencatat transaksi keuangan, mengelola kategori, akun, dan autentikasi pengguna. Database yang digunakan adalah PostgreSQL melalui Prisma ORM.

## 2. Teknologi

- Framework: NestJS v12
- Bahasa: TypeScript (ES modules)
- ORM: Prisma v7
- Database: PostgreSQL
- Validasi: class-validator, class-transformer
- Driver adapter: @prisma/adapter-pg
- Hash password: bcryptjs
- Observability: @nestjs/observe
- Testing: Vitest
- Linter: oxlint
- Formatter: Prettier

## 3. Struktur Direktori

```
src/
├── app.module.ts
├── app.controller.ts
├── app.service.ts
├── main.ts
├── prisma/
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── dto/
│   │   ├── create-auth.dto.ts
│   │   └── login-auth.dto.ts
├── categories/
│   ├── categories.module.ts
│   ├── categories.controller.ts
│   ├── categories.service.ts
│   ├── dto/
│   │   ├── create-category.dto.ts
│   │   └── update-category.dto.ts
│   └── entities/
│       └── category.entity.ts
├── transactions/
│   ├── transactions.module.ts
│   ├── transactions.controller.ts
│   ├── transactions.service.ts
│   ├── dto/
│   │   ├── create-transaction.dto.ts
│   │   └── update-transaction.dto.ts
│   └── entities/
│       └── transaction.entity.ts
└── account/
    ├── account.module.ts
    ├── account.controller.ts
    ├── account.service.ts
    ├── dto/
    │   ├── create-account.dto.ts
    │   └── update-account.dto.ts
    └── entities/
        └── account.entity.ts

prisma/
└── schema.prisma
```

## 4. Skema Database (Prisma)

File: `prisma/schema.prisma`

Model yang tersedia:

### User
- `id` String (UUID, primary key, default uuid())
- `name` String
- `email` String (unique)
- `password` String
- `createdAt` DateTime
- `updatedAt` DateTime

### Category
- `id` String (UUID, primary key, default uuid())
- `name` String (unique)
- `transactions` Transaction[]
- `createdAt` DateTime
- `updatedAt` DateTime

### Transaction
- `id` String (UUID, primary key, default uuid())
- `description` String
- `amount` Int
- `categoryId` String (foreign key ke Category)
- `accountId` String (foreign key ke Account)
- `category` Category (relasi)
- `account` Account (relasi)
- `createdAt` DateTime
- `updatedAt` DateTime

### Account
- `id` String (UUID, primary key)
- `name` String
- `transactions` Transaction[]
- `accountNumber` String? (unique, nullable)
- `type` PaymentMethod (enum)
- `createdAt` DateTime
- `updatedAt` DateTime

### Enum PaymentMethod
- CASH
- BANK
- E_WALLET

## 5. Modul

### PrismaModule (`src/prisma/prisma.module.ts`)
- Menyediakan `PrismaService` yang diekport ke modul lain.
- `PrismaService` extends `PrismaClient` menggunakan `PrismaPg` adapter dengan `DATABASE_URL` dari `ConfigService`.
- Mengimplementasikan `OnModuleInit` (`$connect`) dan `OnModuleDestroy` (`$disconnect`).

### AuthModule (`src/auth/auth.module.ts`)
- Controller: `AuthController`
- Provider: `AuthService`, `PrismaService`
- Catatan: `PrismaService` ditambahkan langsung sebagai provider di sini (bukan melalui `PrismaModule` imports), karena modul auth menggunakan `PrismaService` secara langsung.

### CategoriesModule (`src/categories/categories.module.ts`)
- Imports: `PrismaModule`
- Controller: `CategoriesController`
- Provider: `CategoriesService`
- Alasan `PrismaModule` dimasukkan ke `imports`: `CategoriesService` membutuhkan `PrismaService` yang diexport oleh `PrismaModule`. Tanpa ini, NestJS tidak dapat resolves provider lintas modul.

### TransactionsModule (`src/transactions/transactions.module.ts`)
- Imports: `PrismaModule`
- Controller: `TransactionsController`
- Provider: `TransactionsService`
- Sama seperti CategoriesModule, membutuhkan `PrismaService` untuk operasi database.

### AccountModule (`src/account/account.module.ts`)
- Controller: `AccountController`
- Provider: `AccountService`
- Catatan: belum mengimpor `PrismaModule` dan service-nya masih berupa placeholder (mengembalikan string statis).

### AppModule (`src/app.module.ts`)
- Imports: `ObserveModule`, `ConfigModule` (global), `CategoriesModule`, `TransactionsModule`, `AccountModule`, `AuthModule`
- Controller: `AppController`
- Provider: `AppService`

## 6. Endpoint API

### Auth (`/auth`)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/auth/register` | Registrasi pengguna baru |
| POST | `/auth/login` | Login pengguna |

### Categories (`/categories`)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/categories` | Buat kategori baru |
| GET | `/categories` | Lihat semua kategori |
| GET | `/categories/:id` | Lihat satu kategori |
| PATCH | `/categories/:id` | Update kategori |
| DELETE | `/categories/:id` | Hapus kategori |

### Transactions (`/transactions`)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/transactions` | Buat transaksi baru |
| GET | `/transactions` | Lihat semua transaksi (termasuk relasi category & account) |
| GET | `/transactions/:id` | Lihat satu transaksi |
| PATCH | `/transactions/:id` | Update transaksi |
| DELETE | `/transactions/:id` | Hapus transaksi |

### Account (`/account`)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/account` | Buat akun baru |
| GET | `/account` | Lihat semua akun |
| GET | `/account/:id` | Lihat satu akun |
| PATCH | `/account/:id` | Update akun |
| DELETE | `/account/:id` | Hapus akun |

## 7. DTO dan Validasi

### CreateAuthDto (register)
- `name`: string, wajib diisi, di-trim
- `email`: string, wajib diisi, format email valid
- `password`: string, wajib diisi, minimal 6 karakter

### CreateLoginDto (login)
- `email`: string, wajib diisi, di-trim, format email valid
- `password`: string, wajib diisi

### CreateTransactionDto
- `description`: string, wajib diisi, maksimal 100 karakter, di-trim
- `amount`: integer, wajib diisi, harus lebih besar dari 0
- `categoryId`: string UUID v4, wajib diisi, di-trim
- `accountId`: string UUID v4, wajib diisi

### UpdateTransactionDto
- Turunan `PartialType` dari `CreateTransactionDto`, semua field opsional.

### CreateCategoryDto
- `name`: string, wajib diisi, maksimal 20 karakter, di-trim

### UpdateCategoryDto
- Turunan `PartialType` dari `CreateCategoryDto`, semua field opsional.

Validasi diaktifkan secara global di `main.ts` melalui `ValidationPipe` dengan `whitelist: true` dan `transform: true`.

## 8. Implementasi Service (Ringkasan)

### AuthService
- `register`: cek apakah email sudah terdaftar, throw error jika sudah ada, hash password dengan bcrypt (salt 10), lalu buat user.
- `login`: cek keberadaan email, throw `UnauthorizedException` jika tidak terdaftar, bandingkan password dengan bcrypt, throw `UnauthorizedException` jika salah, lalu return data user (id, name, email) tanpa password.

### CategoriesService
- `create`: cek duplikasi nama kategori, throw `ConflictException` jika sudah ada, lalu buat.
- `findAll`: ambil semua kategori.
- `findOne`: ambil satu kategori berdasarkan ID, throw `NotFoundException` jika tidak ditemukan.
- `update`: cek keberadaan, update nama, throw `NotFoundException` jika tidak ditemukan.
- `remove`: cek keberadaan, hapus, throw `NotFoundException` jika tidak ditemukan.

### TransactionsService
- `create`: validasi keberadaan `categoryId` dan `accountId`, throw `NotFoundException` jika salah satu tidak ada, lalu buat transaksi dengan relasi `connect` ke category dan account.
- `findAll`: ambil semua transaksi dengan include `category` dan `account`.
- `findOne`: ambil satu transaksi berdasarkan ID dengan include `category` dan `account`, throw `NotFoundException` jika tidak ditemukan.
- `update`: cek keberadaan transaksi, pisahkan `categoryId`/`accountId` dari data biasa, validasi relasi jika dikirim, lalu update.
- `remove`: cek keberadaan, hapus transaksi, throw `NotFoundException` jika tidak ditemukan.

### AccountService
- Saat ini masih placeholder (mengembalikan string statis), belum terhubung ke Prisma.

## 9. Menjalankan Proyek

Persiapan environment (file `.env`):
```
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
PORT=3000
```

Perintah yang tersedia (`package.json`):

```bash
# Install dependensi
npm install

# Generate Prisma Client
npx prisma generate

# Jalankan migration (jika ada)
npx prisma migrate dev

# Development mode
npm run start:dev

# Production build
npm run build

# Jalankan production
npm run start:prod

# Lint
npm run lint

# Test
npm run test

# Test coverage
npm run test:cov

# Format kode
npm run format
```

Aplikasi akan berjalan di port `3000` (atau port dari env `PORT`).

## 10. Catatan Penting

- `PrismaModule` harus diimpor ke setiap modul yang membutuhkan `PrismaService` melalui exports, karena `PrismaService` diexport dari `PrismaModule`.
- `AuthModule` memasang `PrismaService` langsung sebagai provider (bukan lewat `PrismaModule` imports).
- Semua ID menggunakan UUID v4.
- Password di-hash dengan bcrypt sebelum disimpan ke database; response login tidak menyertakan password.
- `UpdateTransactionDto` memisahkan field relasi (`categoryId`, `accountId`) dari data biasa saat update agar bisa menggunakan `connect` pada Prisma.
- Entitas `Transaction` dan `Category` di folder `entities/` saat ini masih kosong (hanya class kosong), validasi sebenarnya dilakukan melalui DTO.
- `AccountModule` belum diimpor `PrismaModule` dan service-nya masih placeholder, perlu diimplementasi sesuai kebutuhan.
