import { COORDINATE_DECIMALS, CURRENCY, EMPTY_VALUE, LOCALE } from '@/constants/config';

const MAX_FRACTION_DIGITS = 2;
const MS_PER_MINUTE = 60_000;
const YEAR_PREFIX_LENGTH = 'YYYY-'.length;
const DATETIME_INPUT_LENGTH = 'YYYY-MM-DDTHH:mm'.length;

const parseDate = (iso: string | null | undefined): Date | null => {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatDateTime = (iso: string | null | undefined): string =>
  parseDate(iso)?.toLocaleString(LOCALE, { dateStyle: 'medium', timeStyle: 'short' }) ?? EMPTY_VALUE;

export const formatDate = (iso: string | null | undefined): string =>
  parseDate(iso)?.toLocaleDateString(LOCALE, { dateStyle: 'medium' }) ?? EMPTY_VALUE;

export const formatNumber = (n: number | null | undefined): string =>
  n === null || n === undefined ? EMPTY_VALUE : n.toLocaleString(LOCALE, { maximumFractionDigits: MAX_FRACTION_DIGITS });

export const formatMoney = (amount: number | null | undefined, currency: string = CURRENCY): string =>
  amount === null || amount === undefined ? EMPTY_VALUE : `${formatNumber(amount)} ${currency}`;

export const formatPercent = (n: number | null | undefined): string => (n === null || n === undefined ? EMPTY_VALUE : `${formatNumber(n)}%`);

export const formatShortDate = (iso: string): string => iso.slice(YEAR_PREFIX_LENGTH);

export const formatCoordinates = (lat: number, lng: number): string =>
  `${lat.toFixed(COORDINATE_DECIMALS)}, ${lng.toFixed(COORDINATE_DECIMALS)}`;

export const orDash = (value: string | number | null | undefined): string | number => value ?? EMPTY_VALUE;

export const toDateTimeInput = (iso: string | null | undefined): string => {
  const date = parseDate(iso);
  if (!date) return '';
  const local = new Date(date.getTime() - date.getTimezoneOffset() * MS_PER_MINUTE);
  return local.toISOString().slice(0, DATETIME_INPUT_LENGTH);
};

export const fromDateTimeInput = (value: string): string | null => (value ? new Date(value).toISOString() : null);
