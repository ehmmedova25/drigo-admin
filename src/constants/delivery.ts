import { MAP } from './config';
import type { DriverStatus } from '@/types/delivery.types';

export const DRIVER_STATUSES: DriverStatus[] = ['Online', 'Busy', 'Offline'];

export const DEFAULT_ZONE = {
  centerLat: MAP.center[0],
  centerLng: MAP.center[1],
  radiusKm: 5,
};

export const DELIVERY_TABS = ['Drivers', 'Delivery zones'] as const;
export type DeliveryTab = (typeof DELIVERY_TABS)[number];
