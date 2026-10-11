export const API_PREFIX = '/api/admin';

export const PAGE_SIZE = {
  default: 20,
  small: 10,
  preview: 5,
  lookup: 100,
} as const;

export const TIMING = {
  searchDebounceMs: 400,
  toastMs: 3500,
  trackingPollMs: 10_000,
  chatPollMs: 5_000,
  monitoringPollMs: 15_000,
} as const;

export const LOCALE = 'en-GB';
export const MS_PER_SECOND = 1000;
export const CURRENCY = 'AED';
export const EMPTY_VALUE = '—';
export const COORDINATE_DECIMALS = 4;

export const MAP = {
  center: [25.2048, 55.2708] as [number, number],
  zoom: 10,
  detailZoom: 12,
  markerRadius: { sm: 6, md: 7, lg: 8, xl: 9 },
  tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  colors: { primary: '#5b2ef5', danger: '#d32f2f', success: '#15803d', muted: '#90a1b9' },
} as const;

export const CHART_COLORS = {
  primary: '#5b2ef5',
  medium: '#8f72ff',
  light: '#c4b5fd',
  deep: '#2d1a8c',
} as const;

export const CHART_HEIGHT = 260;
export const CHART_GRID = { stroke: '#efedf8', strokeDasharray: '4 4', vertical: false } as const;
export const CHART_BAR_RADIUS: [number, number, number, number] = [8, 8, 0, 0];
export const CHART_BAR_MAX_SIZE = 28;
export const CHART_AXIS = { axisLine: false, tickLine: false, tick: { fill: '#9a97b8', fontSize: 12 } } as const;
export const CHART_TOOLTIP = {
  contentStyle: { border: 'none', borderRadius: 12, boxShadow: '0 12px 32px rgba(91, 46, 245, 0.14)' },
  cursor: { fill: '#f4f2fc' },
} as const;
export const CHART_AREA_OPACITY = { from: 0.28, to: 0 } as const;
export const CHART_DONUT = { inner: '68%', outer: '92%', padding: 3 } as const;

export const CAR_PHOTO = { dir: '/car-photos', exts: ['.avif', '.png'], welcome: 'welcome' } as const;
