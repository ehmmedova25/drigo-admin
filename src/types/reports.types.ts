export interface MonthRow {
  month: string;
  revenue: { rental: number; extraKm: number; total: number };
  rentals: { total: number; completed: number };
  salik: { trips: number; total: number; billed: number };
  enoc: { transactions: number; liters: number; total: number };
  fines: { billed: number; billedTotal: number };
  debt: { added: number; collected: number };
  operatingCost: number;
  netRevenue: number;
  failedPayments: number;
  newCustomers: number;
}

export interface MonthlyReport {
  months: MonthRow[];
  totals: { revenue: number; salik: number; enoc: number; netRevenue: number };
}

export interface Statistics {
  revenue: { total: number };
  rentals: { total: number; active: number; completed: number; totalDistanceKm: number };
  fleet: { cars: number; utilizationRate: number };
  customers: { total: number; verified: number; withDebt: number };
  debt: { unpaid: number; debtors: number };
}
