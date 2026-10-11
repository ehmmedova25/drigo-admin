import type { FineStatus } from '@/types/fines.types';

export const FINE_STATUSES: FineStatus[] = ['Pending', 'Review', 'Billed', 'Dismissed'];

export const OPEN_FINE_STATUSES: FineStatus[] = ['Pending', 'Review'];

export const FINE_TYPES = ['Speeding', 'Red light', 'Illegal parking', 'No seatbelt', 'Salik unpaid', 'Wrong lane'];

export const FINE_TABS = ['All fines', 'Review queue', 'From scraper', 'By car'] as const;
export type FineTab = (typeof FINE_TABS)[number];
