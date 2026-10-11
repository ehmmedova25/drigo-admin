const MONTH_RANGES = [3, 6, 12] as const;
export const DEFAULT_MONTH_RANGE = 6;

export const MONTH_RANGE_OPTIONS = MONTH_RANGES.map((m) => ({ value: m, label: `Last ${m} months` }));
