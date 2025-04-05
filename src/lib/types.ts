import { $Enums } from "@prisma/client";

export type ApiResponse<T = unknown> = {
  status: boolean;
  statusCode: number;
  message: string;
  results?: T;
};

export type WalletType = {
  id: string; // atau bisa pakai `string` jika dari database kamu serialisasi ke string
  name: string;
  balance: number;
  type: $Enums.TypeWallet; // bisa kamu ganti jadi enum jika type-nya fixed
  userId: string;
  kategori: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserType = {
  id: string;
  email: string;
  name: string;
  image: string | null | undefined;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type TransactionType = {
  id: string;
  category: string;
  description?: string | null;
  balance: number;
  type: $Enums.TransType;
  userId: string;
  walletId: string;
  createdAt: Date;
  updatedAt: Date;
  user?: UserType;
  wallet?: WalletType;
};
