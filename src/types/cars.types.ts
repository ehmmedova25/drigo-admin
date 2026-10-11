export type CarState = 'Rented' | 'Available' | 'Inactive';

export interface CarListItem {
  id: number;
  brandName: string;
  modelName: string;
  manufactureYear: number;
  colorName: string;
  colorHexCode: string | null;
  plateNumber: string | null;
  fuelLevel: number;
  isActive: boolean;
  activeRentalId: number | null;
}

export interface CarDetail {
  id: number;
  brandId: number;
  brandName: string;
  modelId: number | null;
  modelName: string;
  colorId: number | null;
  colorName: string;
  fuelTypeId: number;
  fuelTypeName: string;
  bodyType: string;
  seats: number;
  maxSpeed: number;
  manufactureYear: number;
  engineCapacity: number;
  engineUnit: string;
  distance: number;
  transmission: number;
  plateNumber: string | null;
  chassisNumber: string | null;
  imei: string;
  fuelLevel: number;
  isActive: boolean;
  freeInsurance: boolean;
  price: number | null;
  location: { latitude: number; longitude: number; address: string } | null;
  carFeatures: { id: number; name: string }[];
  endTripAvailableCities: { id: number; name: string }[];
  createdAt: string;
  imageUrl: string | null;
  mediumUrl: string | null;
  thumbnailUrl: string | null;
}

export interface CarStatus {
  engineOn: boolean;
  online: boolean;
  speed: number;
  doorsLocked: boolean;
  activeRentalId: number | null;
}

export interface CarLastActivity {
  lastActivityAt: string | null;
  event: string;
}

export interface ProblematicCar extends CarListItem {
  issues: string[];
}

export interface CarTracking {
  id: number;
  plateNumber: string;
  brandName: string;
  modelName: string;
  latitude: number;
  longitude: number;
  speed: number;
  online: boolean;
  fuelLevel: number;
  activeRentalId: number | null;
  status: CarState;
}

export interface GpsPoint {
  latitude: number;
  longitude: number;
}

export interface CarCommand {
  code: string;
  name: string;
}

export interface NamedItem {
  id: number;
  name: string;
}

export interface Brand {
  id: number;
  name: string;
  carCount: number;
}

export interface CarModel extends NamedItem {
  seats: number;
  maxSpeed: number;
  bodyType: { name: string };
}

export interface CarColor extends NamedItem {
  hexCode: string;
}

export interface CarPayload {
  brandId: number;
  modelId?: number;
  colorId?: number;
  fuelTypeId?: number;
  plateNumber?: string;
  manufactureYear?: number;
  maxSpeed?: number;
  engineCapacity?: number;
  transmission?: number;
  distance?: number;
  chassisNumber?: string;
}
