export interface Kpis {
  activeRentals: number;
  activeReservations: number;
  openSupportTickets: number;
  todayRevenue: number;
  monthlyRevenue: number;
  totalDebt: number;
  pendingVerificationCount: number;
  totalMembers: number;
}

export interface DailyCount {
  date: string;
  count: number;
}

export interface Trends {
  rentalTrends: DailyCount[];
  reservationTrends: DailyCount[];
  revenueTrends: { date: string; revenue: number }[];
}

export interface FleetSummary {
  total: number;
  available: number;
  rented: number;
  inactive: number;
  online: number;
  lowFuel: number;
  byCity: { city: string; count: number }[];
}

export interface ActivityItem {
  id: number;
  message: string;
  at: string;
}

export interface OnlineUser {
  userId: string;
  fullName: string;
  platform: string;
  lastLoginAt: string | null;
}
