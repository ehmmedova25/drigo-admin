export interface Debt {
  id: number;
  type: string;
  description: string;
  amount: number;
  currency: string;
  isPaid: boolean;
  paidAt: string | null;
  billedTo: string | null;
  createdAt: string;
}

export interface CustomerDebts {
  userId: string;
  totalDebt: number;
  currency: string;
  debts: Debt[];
}

export interface Debtor {
  id: string;
  fullName: string;
  phoneNumber: string;
  isBlocked: boolean;
  totalDebt: number;
}

export interface DebtRow extends Debt {
  userId: string;
  userName: string | null;
}

export interface NewDebt {
  type: string;
  amount: number;
  description?: string;
}
