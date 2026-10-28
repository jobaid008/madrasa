export type Language = 'bn' | 'en';

export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  nameBn: string;
  nameEn: string;
  type: TransactionType;
  color?: string;
  icon?: string;
}

export interface Transaction {
  id: string;
  sl: number;
  date: string; // YYYY-MM-DD
  type: TransactionType;
  categoryId: string;
  categoryNameBn: string;
  categoryNameEn: string;
  description: string;
  amount: number;
  donorOrPayee?: string;
  phone?: string;
  paymentMethod: 'cash' | 'bkash' | 'nagad' | 'bank';
  voucherNo?: string;
  isPublic: boolean;
  createdAt: string;
  attachmentUrl?: string;
  attachmentType?: 'image' | 'pdf';
  attachmentName?: string;
}

export interface MadrasaInfo {
  nameBn: string;
  nameEn: string;
  addressBn: string;
  addressEn: string;
  establishedBn: string;
  establishedEn: string;
  registrationBn: string;
  registrationEn: string;
  mahatamimBn: string;
  mahatamimEn: string;
  mahatamimPhone: string;
  officePhone: string;
  email: string;
  announcementBn: string;
  announcementEn: string;
  noticeAnimation?: 'marquee' | 'bounce' | 'pulse';
  noticeSpeed?: number;
  openingBalance: number;
}

export interface UserSession {
  isAuthenticated: boolean;
  username: string;
  phone: string;
  role: 'super_admin' | 'admin' | 'accountant';
  mustChangePassword?: boolean;
}
