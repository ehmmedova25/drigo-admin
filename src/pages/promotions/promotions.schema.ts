import * as yup from 'yup';
import { FORM_MESSAGES } from '@/constants/messages';
import {
  DISCOUNT_AUDIENCES,
  DISCOUNT_SCOPES,
  DISCOUNT_TYPES,
  PROMO_DISCOUNT_TYPES,
  PROMOTION_ACTIONS,
  PROMOTION_FREQUENCIES,
  STORY_AUDIENCES,
  STORY_STATUSES,
} from '@/constants/promotions';
import type {
  DiscountAudience,
  DiscountScope,
  DiscountType,
  PromoDiscountType,
  PromotionAction,
  PromotionFrequency,
  StoryAudience,
  StoryStatus,
} from '@/types/promotions.types';
import { amountField, idField, numberField } from '@/utils/validation';

export const promotionSchema = yup.object({
  title: yup.string().trim().required(FORM_MESSAGES.REQUIRED),
  description: yup.string().default(''),
  actionType: yup.mixed<PromotionAction>().oneOf(PROMOTION_ACTIONS).required(FORM_MESSAGES.REQUIRED),
  frequency: yup.mixed<PromotionFrequency>().oneOf(PROMOTION_FREQUENCIES).required(FORM_MESSAGES.REQUIRED),
  startDate: yup.string().default(''),
  endDate: yup.string().default(''),
});

export type PromotionFormValues = yup.InferType<typeof promotionSchema>;

export const discountSchema = yup.object({
  name: yup.string().trim().required(FORM_MESSAGES.REQUIRED),
  type: yup.mixed<DiscountType>().oneOf(DISCOUNT_TYPES).required(FORM_MESSAGES.REQUIRED),
  value: numberField().positive(FORM_MESSAGES.POSITIVE).required(FORM_MESSAGES.REQUIRED),
  targetAudience: yup.mixed<DiscountAudience>().oneOf(DISCOUNT_AUDIENCES).required(FORM_MESSAGES.REQUIRED),
  scope: yup.mixed<DiscountScope>().oneOf(DISCOUNT_SCOPES).required(FORM_MESSAGES.REQUIRED),
  usageLimit: idField().optional(),
  startDate: yup.string().default(''),
  endDate: yup.string().default(''),
});

export type DiscountFormValues = yup.InferType<typeof discountSchema>;

export const promoCodeSchema = yup.object({
  code: yup.string().trim().required(FORM_MESSAGES.REQUIRED),
  discountType: yup.mixed<PromoDiscountType>().oneOf(PROMO_DISCOUNT_TYPES).required(FORM_MESSAGES.REQUIRED),
  value: numberField().positive(FORM_MESSAGES.POSITIVE).required(FORM_MESSAGES.REQUIRED),
  maxRedemptions: idField().optional(),
  expiresAt: yup.string().default(''),
});

export type PromoCodeFormValues = yup.InferType<typeof promoCodeSchema>;

export const storySchema = yup.object({
  title: yup.string().trim().required(FORM_MESSAGES.REQUIRED),
  status: yup.mixed<StoryStatus>().oneOf(STORY_STATUSES).required(FORM_MESSAGES.REQUIRED),
  targetAudience: yup.mixed<StoryAudience>().oneOf(STORY_AUDIENCES).required(FORM_MESSAGES.REQUIRED),
});

export type StoryFormValues = yup.InferType<typeof storySchema>;

export const referralSettingsSchema = yup.object({
  referrerBonus: amountField().required(FORM_MESSAGES.REQUIRED),
  refereeBonus: amountField().required(FORM_MESSAGES.REQUIRED),
  minRentalsToQualify: amountField().integer(FORM_MESSAGES.INTEGER).required(FORM_MESSAGES.REQUIRED),
  isActive: yup.boolean().required(),
});

export type ReferralSettingsFormValues = yup.InferType<typeof referralSettingsSchema>;
