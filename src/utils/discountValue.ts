import { formatMoney } from './format';
import type { DiscountType } from '@/types/promotions.types';

export const formatDiscountValue = (type: DiscountType, value: number): string => {
  if (type === 'Percentage') return `${value}%`;
  if (type === 'FixedAmount') return `${formatMoney(value)} off`;
  return formatMoney(value);
};
