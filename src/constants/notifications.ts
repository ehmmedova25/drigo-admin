import type { Audience, CampaignStatus, NotificationMessage } from '@/types/notifications.types';

export const NOTIFICATION_TABS = ['Send', 'Campaigns', 'Scheduled', 'History', 'App texts'] as const;
export type NotificationTab = (typeof NOTIFICATION_TABS)[number];

export const AUDIENCES: Audience[] = ['All', 'Verified', 'Unverified', 'WithDebt', 'Inactive'];

export const SENDABLE_CAMPAIGN_STATUSES: CampaignStatus[] = ['Draft', 'Scheduled'];

export const HISTORY_PAGE_SIZE = 50;

export const EMPTY_MESSAGE: NotificationMessage = { title: '', body: '', targetAudience: 'All' };
