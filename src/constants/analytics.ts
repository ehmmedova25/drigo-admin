const DAY_RANGES = [7, 30, 90] as const;
export const DEFAULT_DAY_RANGE = 30;
export const DAY_RANGE_OPTIONS = DAY_RANGES.map((d) => ({ value: d, label: `Last ${d} days` }));
