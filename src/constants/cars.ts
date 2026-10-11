import { MAP } from './config';
import type { CarState } from '@/types/cars.types';

export const TRANSMISSIONS = [
  { value: 0, label: 'Automatic' },
  { value: 1, label: 'Manual' },
  { value: 2, label: 'Semi-automatic' },
];

export const CAR_SORT_OPTIONS = [
  { value: 'createdAt', label: 'Sort: added' },
  { value: 'manufactureYear', label: 'Sort: year' },
  { value: 'fuelLevel', label: 'Sort: fuel level' },
  { value: 'brandName', label: 'Sort: brand' },
];

export const CAR_STATE_COLORS: Record<CarState, string> = {
  Rented: MAP.colors.primary,
  Available: MAP.colors.success,
  Inactive: MAP.colors.muted,
};

export const DEFAULT_MANUFACTURE_YEAR = new Date().getFullYear();

export const CAR_TABS = ['All cars', 'Problematic'] as const;
export type CarTab = (typeof CAR_TABS)[number];

export const TRACKING_FILTERS: CarState[] = ['Rented', 'Available'];
