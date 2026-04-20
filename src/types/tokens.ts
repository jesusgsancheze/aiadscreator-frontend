export type TransactionStatus = 'pending' | 'approved' | 'rejected';
export type TransactionType = 'purchase' | 'admin_grant' | 'campaign_spend' | 'refund';
export type PaymentMethodType = 'binance' | 'zelle' | 'pago_movil';

export interface TokenTransaction {
  _id: string;
  userId: string;
  user?: { _id: string; firstName: string; lastName: string; email: string };
  type: TransactionType;
  tokens: number;
  amountUsd: number | null;
  paymentMethod: PaymentMethodType | null;
  paymentReference: string | null;
  paymentProof: string | null;
  status: TransactionStatus;
  adminNote: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  packageId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethodConfig {
  type: PaymentMethodType;
  isActive: boolean;
  config: Record<string, string>;
}

export interface CampaignCost {
  copyCaption: number;
  images: number;
  total: number;
}

export interface TokenPackage {
  id: string;
  tokens: number;
  price: number;
  label: string;
  bonus?: string;
}

export interface IncomeReport {
  totalIncome: number;
  totalTokensSold: number;
  transactionCount: number;
  byPaymentMethod: Array<{ _id: string; totalIncome: number; totalTokens: number; count: number }>;
}

export interface AdminTransactionFilters {
  status?: TransactionStatus;
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface IncomeReportFilters {
  dateFrom?: string;
  dateTo?: string;
  userId?: string;
}
