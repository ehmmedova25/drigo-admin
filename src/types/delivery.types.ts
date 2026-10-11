export type DriverStatus = 'Online' | 'Busy' | 'Offline';

export interface Driver {
  id: number;
  fullName: string;
  phoneNumber: string;
  email: string;
  status: DriverStatus;
  isActive: boolean;
  activeDeliveries: number;
  completedDeliveries: number;
  rating: number;
}

export type DriverPayload = Pick<Driver, 'fullName' | 'phoneNumber' | 'email'> & { status?: DriverStatus };

export interface Zone {
  id: number;
  name: string;
  centerLat: number;
  centerLng: number;
  radiusKm: number;
  isActive: boolean;
  driverCount: number;
}

export type ZonePayload = Omit<Zone, 'id' | 'driverCount'>;
