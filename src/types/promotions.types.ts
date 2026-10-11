export type PromotionAction = 'OpenCar' | 'OpenTariff' | 'OpenUrl' | 'None';
export type PromotionFrequency = 'Once' | 'Daily' | 'Always';

export interface Promotion {
  id: number;
  title: string;
  description: string;
  actionType: PromotionAction;
  frequency: PromotionFrequency;
  imageUrl: string;
  isActive: boolean;
  startDate: string;
  endDate: string | null;
  createdAt: string;
}
export type PromotionPayload = Pick<Promotion, 'title' | 'description' | 'actionType' | 'frequency' | 'startDate' | 'endDate'>;

export type DiscountType = 'Percentage' | 'FixedAmount' | 'FixedPrice';
export type DiscountStatus = 'Active' | 'Scheduled' | 'Expired' | 'Paused';
export type DiscountAudience = 'All' | 'NewUsers' | 'Specific' | 'WithDebt';
export type DiscountScope = 'Global' | 'Brand' | 'Car' | 'TariffPackage';

export interface Discount {
  id: number;
  name: string;
  type: DiscountType;
  value: number;
  status: DiscountStatus;
  targetAudience: DiscountAudience;
  scope: DiscountScope;
  usageLimit: number | null;
  usedCount: number;
  startDate: string;
  endDate: string | null;
  createdAt: string;
}
export type DiscountPayload = Pick<Discount, 'name' | 'type' | 'value' | 'targetAudience' | 'scope' | 'usageLimit' | 'startDate' | 'endDate'>;

export interface DiscountAnalytics {
  discountId: number;
  totalUses: number;
  uniqueUsers: number;
  totalDiscounted: number;
  conversionRate: number;
  currency: string;
}

export interface DiscountUsage {
  id: number;
  userId: string;
  userName: string;
  amount: number;
  usedAt: string;
}

export type PromoDiscountType = 'Percentage' | 'FixedAmount';

export interface PromoCode {
  id: number;
  code: string;
  discountType: PromoDiscountType;
  value: number;
  maxRedemptions: number | null;
  redemptionCount: number;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
}
export type PromoCodePayload = Pick<PromoCode, 'code' | 'discountType' | 'value' | 'maxRedemptions' | 'expiresAt'>;

export type StoryStatus = 'Active' | 'Draft' | 'Archived';
export type StoryAudience = 'All' | 'Verified';

export interface StoryItem {
  id: number;
  mediaType: 'Image' | 'Video';
  mediaUrl: string;
  durationSec: number;
  viewCount: number;
}

export interface Story {
  id: number;
  title: string;
  status: StoryStatus;
  targetAudience: StoryAudience;
  items: StoryItem[];
  viewCount: number;
  createdAt: string;
}
export type StoryPayload = Pick<Story, 'title' | 'status' | 'targetAudience'>;

export interface StoryAnalytics {
  storyId: number;
  totalViews: number;
  items: { itemId: number; views: number; completionRate: number }[];
}

export interface ReferralSettings {
  referrerBonus: number;
  refereeBonus: number;
  currency: string;
  minRentalsToQualify: number;
  isActive: boolean;
  updatedAt: string;
}
export type ReferralSettingsPayload = Pick<ReferralSettings, 'referrerBonus' | 'refereeBonus' | 'minRentalsToQualify' | 'isActive'>;

export interface TopReferrer {
  userId: string;
  fullName: string;
  referredCount: number;
  bonusEarned: number;
}
