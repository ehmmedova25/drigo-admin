export const MONITORING_TABS = ['Overview', 'Logs', 'Database', 'GPS devices'] as const;
export type MonitoringTab = (typeof MONITORING_TABS)[number];

export const LOGS_PAGE_SIZE = 50;
export const MAX_SIGNAL = 5;
export const SECONDS_PER_HOUR = 3600;
