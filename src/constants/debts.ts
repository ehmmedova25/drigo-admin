export const DEBT_TYPES = ['Manual', 'Fine', 'Salik', 'Fuel', 'Cleaning', 'Damage', 'ExtraKm', 'ServiceFee'];

export const SPLIT_PARTS = { min: 2, max: 12 } as const;

export const PAID_FILTER_OPTIONS = [
  { value: 'false', label: 'Unpaid' },
  { value: 'true', label: 'Paid' },
];

export const DEBT_TABS = ['Debtors', 'All debts'] as const;
export type DebtTab = (typeof DEBT_TABS)[number];
