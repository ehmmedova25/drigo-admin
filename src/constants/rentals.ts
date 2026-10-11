import type { RentalStatus } from '@/types/rentals.types';

export const RENTAL_STATUSES: readonly RentalStatus[] = ['Active', 'Started', 'Completed', 'PaymentPending', 'Cancelled', 'Accident'];

export const ENDABLE_STATUSES: readonly RentalStatus[] = ['Active', 'Started', 'PaymentPending'];

export const RENTAL_SORT_OPTIONS = [
  { value: 'startDate', label: 'Sort: start date' },
  { value: 'endDate', label: 'Sort: end date' },
  { value: 'totalPrice', label: 'Sort: total price' },
  { value: 'status', label: 'Sort: status' },
];

