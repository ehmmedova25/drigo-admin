export type FineStatus = 'Pending' | 'Review' | 'Billed' | 'Dismissed';

export interface Fine {
  id: number;
  carId: number | null;
  plateNumber: string | null;
  rentalId: number | null;
  userId: string | null;
  type: string;
  referenceNumber: string;
  amount: number;
  currency: string;
  fineDate: string;
  location: string;
  status: FineStatus;
  billedTo: 'Customer' | 'Company' | null;
}

export interface FineRentalOption {
  rentalId: number;
  userName: string;
  startDate: string;
  endDate: string | null;
}

export interface NewFine {
  carId: number;
  type: string;
  amount: number;
  location?: string;
}

export interface CarFinesSummary {
  carId: number;
  plateNumber: string;
  carName: string;
  totalFines: number;
  unpaidCount: number;
  totalAmount: number;
  currency: string;
  lastSyncedAt: string | null;
}

export interface CarFinesDetail {
  carId: number;
  plateNumber: string;
  carName: string;
  totalAmount: number;
  fines: Fine[];
}

export type FineDecision = 'bill-company' | 'dismiss' | 'unbill';
