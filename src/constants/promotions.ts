import type {
  DiscountAudience,
  DiscountScope,
  DiscountStatus,
  DiscountType,
  PromoDiscountType,
  PromotionAction,
  PromotionFrequency,
  StoryAudience,
  StoryStatus,
} from '@/types/promotions.types';

export const PROMOTION_TABS = ['Promotions', 'Discounts', 'Promo codes', 'Stories', 'Referrals'] as const;
export type PromotionTab = (typeof PROMOTION_TABS)[number];

export const PROMOTION_ACTIONS: PromotionAction[] = ['None', 'OpenCar', 'OpenTariff', 'OpenUrl'];
export const PROMOTION_FREQUENCIES: PromotionFrequency[] = ['Once', 'Daily', 'Always'];

export const DISCOUNT_TYPES: DiscountType[] = ['Percentage', 'FixedAmount', 'FixedPrice'];
export const DISCOUNT_STATUSES: DiscountStatus[] = ['Active', 'Scheduled', 'Paused', 'Expired'];
export const DISCOUNT_AUDIENCES: DiscountAudience[] = ['All', 'NewUsers', 'Specific', 'WithDebt'];
export const DISCOUNT_SCOPES: DiscountScope[] = ['Global', 'Brand', 'Car', 'TariffPackage'];

export const PROMO_DISCOUNT_TYPES: PromoDiscountType[] = ['Percentage', 'FixedAmount'];

export const STORY_STATUSES: StoryStatus[] = ['Draft', 'Active', 'Archived'];
export const STORY_AUDIENCES: StoryAudience[] = ['All', 'Verified'];

export const TOP_REFERRERS = 10;
export const UNLIMITED = '∞';
