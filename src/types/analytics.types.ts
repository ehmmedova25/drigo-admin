export interface DailySeries<P> {
  days: number;
  points: P[];
}
export type RevenuePoint = { date: string; revenue: number };
export type UtilizationPoint = { date: string; utilization: number };
export type DebtPoint = { date: string; added: number; collected: number };

export interface DebtBreakdown {
  total: number;
  currency: string;
  byType: { type: string; amount: number }[];
  buckets: { label: string; amount: number }[];
  debtorCount: number;
}

export interface CustomerFunnel {
  steps: { step: string; count: number }[];
}

export interface Demographics {
  total: number;
  gender: { gender: string; count: number }[];
  age: { range: string; count: number }[];
  platform: { platform: string; count: number }[];
}

export interface FleetHealth {
  total: number;
  conditions: { condition: string; count: number }[];
  openProblemReports: number;
  openAccidents: number;
}
