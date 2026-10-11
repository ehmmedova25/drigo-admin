export interface CityTarget {
  city: string;
  targetCars: number;
  currentCars: number;
}

export interface FleetPlan {
  updatedAt: string;
  targets: CityTarget[];
}

export interface FleetMove {
  id: number;
  carId: number;
  plateNumber: string;
  fromCity: string;
  toCity: string;
  status: 'Planned' | 'InProgress' | 'Completed';
  assignedTo: string;
  scheduledAt: string;
  createdAt: string;
}

export interface UtilizationSummary {
  totalCars: number;
  activeCars: number;
  idleCars: number;
  utilizationRate: number;
  totalRevenue: number;
  totalDistance: number;
  avgRevenuePerCar: number;
  currency: string;
}

export interface CarUtilization {
  carId: number;
  plateNumber: string;
  carName: string;
  isActive: boolean;
  currentlyRented: boolean;
  rentalCount: number;
  totalDistance: number;
  revenue: number;
}
