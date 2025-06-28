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
  transaction?: TransactionType[];
  moveTransaction?: TransactionType[];
};

export type UserType = SessionUser;

export type TransactionType = {
  id: string;
  category?: string;
  description?: string | null;
  balance: number;
  type: $Enums.TransType;
  status?: $Enums.StatusTrans;
  userId?: string;
  walletId?: string;
  fromId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  user?: UserType | null;
  wallet?: WalletType | null;
  fromWallet?: WalletType | null;
};

export type TPlanning = {
  id: string;
  name: string;
  description: string;
  price: number;
  deadline: Date;
  icon: string;
  userId: string;
  recurrenceType: $Enums.RecurenceT;
  createdAt: Date;
  updatedAt: Date;
  user?: UserType;
};

export type TProvider =
  | "github"
  | "apple"
  | "discord"
  | "facebook"
  | "microsoft"
  | "google"
  | "spotify"
  | "twitch"
  | "twitter"
  | "dropbox"
  | "kick"
  | "linkedin"
  | "gitlab"
  | "tiktok"
  | "reddit"
  | "roblox"
  | "vk";

export type TLedger = {
  from?: {
    id: string;
    name: string | null;
  };
  to?: {
    id: string;
    name: string | null;
  };
} & {
  id: string;
  amount: number;
  paidMount: number;
  walletId?: string;
  status: $Enums.StatusLedger;
  createdAt?: Date;
  udpatedAt?: Date;
};
