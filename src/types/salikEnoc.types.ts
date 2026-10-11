export interface SalikTrip {
  id: number;
  carId: number;
  plateNumber: string;
  rentalId: number | null;
  gate: string;
  amount: number;
  currency: string;
  tripDate: string;
  billed: boolean;
}

export interface SalikSummary {
  totalTrips: number;
  totalAmount: number;
  billedAmount: number;
  unbilledAmount: number;
  currency: string;
}

export interface EnocTransaction {
  id: number;
  carId: number;
  plateNumber: string;
  rentalId: number | null;
  station: string;
  liters: number;
  pricePerLiter: number;
  amount: number;
  currency: string;
  transactionDate: string;
}

export interface EnocSummary {
  totalTransactions: number;
  totalLiters: number;
  totalAmount: number;
  currency: string;
}

export interface ScraperSource {
  source: string;
  status: string;
  lastRunAt: string;
}

export interface ScrapeRun {
  id: number;
  source: string;
  status: 'Success' | 'Failed' | 'Partial';
  itemsFound: number;
  startedAt: string;
  finishedAt: string;
}
