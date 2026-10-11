import type { BookingStatus } from '@/types/subscriptions.types';

export const BOOKING_STATUSES: BookingStatus[] = ['Pending', 'Active', 'Assigned', 'Completed', 'Cancelled'];

export const SUBSCRIPTION_TABS = ['Plans by model', 'Bookings'] as const;
export type SubscriptionTab = (typeof SUBSCRIPTION_TABS)[number];

export const DEFAULT_PLAN = { includedKm: 1500, minMonths: 1 };
