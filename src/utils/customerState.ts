import type { CustomerState } from '@/types/customers.types';

export const customerState = (c: { isDeleted: boolean; isBlocked: boolean; isApproved: boolean }): CustomerState => {
  if (c.isDeleted) return 'Deleted';
  if (c.isBlocked) return 'Blocked';
  return c.isApproved ? 'Verified' : 'Pending';
};
