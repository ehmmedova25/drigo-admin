import type { TimeUnit } from '@/types/tariffs.types';

export const TIME_UNITS: TimeUnit[] = ['Hour', 'Day', 'Week', 'Month'];

export const TARIFF_TABS = ['Packages', 'Plans', 'Templates', 'Distances & insurance', 'Overage charges'] as const;
export type TariffTab = (typeof TARIFF_TABS)[number];

export const DEFAULT_PACKAGE: { unitCount: number; timeUnit: TimeUnit } = { unitCount: 1, timeUnit: 'Day' };
