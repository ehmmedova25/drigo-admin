export type Audience = 'All' | 'Verified' | 'Unverified' | 'WithDebt' | 'Inactive';
export type CampaignStatus = 'Draft' | 'Scheduled' | 'Sending' | 'Sent' | 'Cancelled';

export interface SendResult {
  success: boolean;
  recipientCount: number;
  sentAt: string;
}

export interface NotificationMessage {
  title: string;
  body: string;
  targetAudience: Audience;
}

export interface HistoryItem {
  id: number;
  title: string;
  body: string;
  type: 'Broadcast' | 'Direct' | 'Geo' | 'System' | 'Campaign';
  targetUserId: string | null;
  channel: 'Push' | 'InApp';
  status: 'Delivered' | 'Failed';
  createdAt: string;
}

export interface Campaign extends NotificationMessage {
  id: number;
  status: CampaignStatus;
  scheduledAt: string | null;
  sentAt: string | null;
  recipientCount: number;
  openCount: number;
  createdAt: string;
}
export type CampaignPayload = NotificationMessage & { scheduledAt: string | null };

export interface ScheduledNotification extends NotificationMessage {
  id: number;
  scheduledAt: string;
  createdAt: string;
}
export type ScheduledPayload = NotificationMessage & { scheduledAt: string };

export interface MobileText {
  id: number;
  key: string;
  value: string;
  language: string;
  updatedAt: string;
}
