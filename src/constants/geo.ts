import { MAP } from './config';
import type { GeoZoneType } from '@/types/geo.types';

export const GEO_TABS = ['Geo zones', 'Parking zones', 'Gas stations'] as const;
export type GeoTab = (typeof GEO_TABS)[number];

export const GEO_ZONE_TYPES: GeoZoneType[] = ['Operating', 'Restricted', 'NoParking', 'Premium'];

export const DEFAULT_GEO_ZONE = {
  center: { lat: MAP.center[0], lng: MAP.center[1] },
  sizeKm: 5,
  color: MAP.colors.primary,
};
