export type RentalStatus = 'Active' | 'Started' | 'Completed' | 'PaymentPending' | 'Cancelled' | 'Accident';

export interface RentalListItem {
  id: number;
  user: { id: string; fullName: string; phoneNumber: string };
  car: { id: number; plateNumber: string; brand: string; model: string };
  startDate: string;
  endDate: string | null;
  status: RentalStatus;
  tariffName: string | null;
  totalPaid: number;
  userTotalDebt: number;
}

export interface RentalRoute {
  coordinates: { latitude: number; longitude: number }[];
}

export interface RentalDebt {
  id: number;
  type: string;
  description: string;
  amount: number;
  isPaid: boolean;
}

export interface PaymentRetryState {
  attempts: number;
  lastError: string;
  nextRetryAt: string;
  amountDue: number;
}

export interface RentalDetail {
  id: number;
  status: RentalStatus;
  user: { id: string; fullName: string; phoneNumber: string; email: string };
  car: { id: number; plateNumber: string; brand: string; model: string; color: string; fuelType: string | null; year: number | null };
  tariff: { packageName: string; activePrice: number; includedDistance: number } | null;
  insurance: { name: string; dailyPrice: number } | null;
  startDate: string;
  endDate: string | null;
  nextPaymentDue: string | null;
  nextPaymentTotal: number | null;
  paymentGracePeriodUntil: string | null;
  totalPrice: number;
  totalDistance: number;
  purchasedDistanceTotal: number | null;
  compensationDistanceTotal: number | null;
  discountName: string | null;
  discountAmount: number | null;
  totalDebt: number;
  hasAccident: boolean;
  cancelReason: string | null;
  paymentRetryState: PaymentRetryState | null;
  debts: RentalDebt[];
  actionHistory: { id: number; action: string; at: string; by: string; note: string | null }[];
  userRentalHistory: { id: number; status: RentalStatus; startDate: string; totalPrice: number }[];
  startPhotoUrls: string[];
  endPhotoUrls: string[];
}

export interface Payment {
  id: number;
  amount: number;
  currency: string;
  status: 'Succeeded' | 'Failed';
  transactionType: string;
  failureReason: string | null;
  createdAt: string;
}

export interface KmPackageOption {
  id: number;
  km: number;
  price: number;
  currency: string;
}
