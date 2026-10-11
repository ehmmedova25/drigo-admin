export interface LatLng {
  lat: number;
  lng: number;
}

export type GeoZoneType = 'Operating' | 'Restricted' | 'NoParking' | 'Premium';

export interface GeoZone {
  id: number;
  name: string;
  type: GeoZoneType;
  isActive: boolean;
  polygon: LatLng[];
  color: string;
  createdAt: string;
}
export type GeoZonePayload = Pick<GeoZone, 'name' | 'type' | 'isActive' | 'polygon' | 'color'>;

export interface ParkingZone {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  isFree: boolean;
}

export interface GasStation {
  id: number;
  name: string;
  brand: string;
  latitude: number;
  longitude: number;
}
