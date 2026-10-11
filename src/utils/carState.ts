import type { CarState } from '@/types/cars.types';

export const carState = (isActive: boolean, isRented: boolean): CarState => {
  if (isRented) return 'Rented';
  return isActive ? 'Available' : 'Inactive';
};
