import { $Enums } from "@prisma/client";
import { auth } from "./auth";

export type SessionUser = typeof auth.$Infer.Session.user;

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
  category: $Enums.CateWallet;
  createdAt: Date;
  updatedAt: Date;
  transaction?: TransactionType[] | null;
  moveTransaction?: TransactionType[] | null;
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
  status: $Enums.StatusTrans;
  userId: string;
  walletId: string;
  fromId: string | null;
  createdAt: Date;
  updatedAt: Date;
  user?: UserType | null;
  wallet?: WalletType | null;
  fromWallet?: WalletType | null;
};
