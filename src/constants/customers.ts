export const APPROVAL_FILTERS = [
  { value: 'pending', label: 'Pending verification' },
  { value: 'approved', label: 'Approved' },
  { value: 'blocked', label: 'Blocked' },
];

export const CUSTOMER_TABS = ['Overview', 'Rentals', 'Payments', 'Debt', 'Bonus', 'Reservations', 'Devices', 'Login history'] as const;
export type CustomerTab = (typeof CUSTOMER_TABS)[number];
