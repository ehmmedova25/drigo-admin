import { baseApi } from '@/api/baseApi';
import type { Paged, Query, SuccessResponse } from '@/api/types';
import { TOP_REFERRERS } from '@/constants/promotions';
import type {
  Discount,
  DiscountAnalytics,
  DiscountPayload,
  DiscountStatus,
  DiscountUsage,
  PromoCode,
  PromoCodePayload,
  Promotion,
  PromotionPayload,
  ReferralSettings,
  ReferralSettingsPayload,
  Story,
  StoryAnalytics,
  StoryPayload,
  StoryStatus,
  TopReferrer,
} from '@/types/promotions.types';

export const promotionsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPromotions: build.query<Paged<Promotion>, Query>({
      query: (params) => ({ url: '/promotions', params }),
      providesTags: ['Promotion'],
    }),
    createPromotion: build.mutation<Promotion, PromotionPayload>({
      query: (body) => ({ url: '/promotions', method: 'POST', body }),
      invalidatesTags: ['Promotion'],
    }),
    updatePromotion: build.mutation<Promotion, { id: number; payload: PromotionPayload }>({
      query: ({ id, payload }) => ({ url: `/promotions/${id}`, method: 'PUT', body: payload }),
      invalidatesTags: ['Promotion'],
    }),
    setPromotionActive: build.mutation<unknown, { id: number; isActive: boolean }>({
      query: ({ id, isActive }) => ({ url: `/promotions/${id}/status`, method: 'PATCH', body: { isActive } }),
      invalidatesTags: ['Promotion'],
    }),
    deletePromotion: build.mutation<SuccessResponse, number>({
      query: (id) => ({ url: `/promotions/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Promotion'],
    }),
    getDiscounts: build.query<Paged<Discount>, Query>({
      query: (params) => ({ url: '/discounts', params }),
      providesTags: ['Promotion'],
    }),
    createDiscount: build.mutation<Discount, DiscountPayload>({
      query: (body) => ({ url: '/discounts', method: 'POST', body }),
      invalidatesTags: ['Promotion'],
    }),
    updateDiscount: build.mutation<Discount, { id: number; payload: DiscountPayload }>({
      query: ({ id, payload }) => ({ url: `/discounts/${id}`, method: 'PUT', body: payload }),
      invalidatesTags: ['Promotion'],
    }),
    setDiscountStatus: build.mutation<unknown, { id: number; status: DiscountStatus }>({
      query: ({ id, status }) => ({ url: `/discounts/${id}/status`, method: 'PATCH', body: { status } }),
      invalidatesTags: ['Promotion'],
    }),
    deleteDiscount: build.mutation<SuccessResponse, number>({
      query: (id) => ({ url: `/discounts/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Promotion'],
    }),
    getDiscountAnalytics: build.query<DiscountAnalytics, number>({
      query: (id) => `/discounts/${id}/analytics`,
      providesTags: ['Promotion'],
    }),
    getDiscountUsage: build.query<DiscountUsage[], number>({
      query: (id) => `/discounts/${id}/usage-history`,
      providesTags: ['Promotion'],
    }),
    getPromoCodes: build.query<Paged<PromoCode>, Query>({
      query: (params) => ({ url: '/promo-codes', params }),
      providesTags: ['Promotion'],
    }),
    createPromoCode: build.mutation<PromoCode, PromoCodePayload>({
      query: (body) => ({ url: '/promo-codes', method: 'POST', body }),
      invalidatesTags: ['Promotion'],
    }),
    updatePromoCode: build.mutation<PromoCode, { id: number; payload: PromoCodePayload }>({
      query: ({ id, payload }) => ({ url: `/promo-codes/${id}`, method: 'PUT', body: payload }),
      invalidatesTags: ['Promotion'],
    }),
    togglePromoCode: build.mutation<unknown, number>({
      query: (id) => ({ url: `/promo-codes/${id}/toggle`, method: 'PATCH' }),
      invalidatesTags: ['Promotion'],
    }),
    deletePromoCode: build.mutation<SuccessResponse, number>({
      query: (id) => ({ url: `/promo-codes/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Promotion'],
    }),
    getStories: build.query<Story[], void>({
      query: () => '/stories',
      providesTags: ['Promotion'],
    }),
    createStory: build.mutation<Story, StoryPayload>({
      query: (body) => ({ url: '/stories', method: 'POST', body }),
      invalidatesTags: ['Promotion'],
    }),
    updateStory: build.mutation<Story, { id: number; payload: StoryPayload }>({
      query: ({ id, payload }) => ({ url: `/stories/${id}`, method: 'PUT', body: payload }),
      invalidatesTags: ['Promotion'],
    }),
    setStoryStatus: build.mutation<unknown, { id: number; status: StoryStatus }>({
      query: ({ id, status }) => ({ url: `/stories/${id}/status`, method: 'PATCH', body: { status } }),
      invalidatesTags: ['Promotion'],
    }),
    deleteStory: build.mutation<SuccessResponse, number>({
      query: (id) => ({ url: `/stories/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Promotion'],
    }),
    getStoryAnalytics: build.query<StoryAnalytics, number>({
      query: (id) => `/stories/${id}/analytics`,
      providesTags: ['Promotion'],
    }),
    getReferralSettings: build.query<ReferralSettings, void>({
      query: () => '/referrals/settings',
      providesTags: ['Promotion'],
    }),
    saveReferralSettings: build.mutation<ReferralSettings, ReferralSettingsPayload>({
      query: (body) => ({ url: '/referrals/settings', method: 'PUT', body }),
      invalidatesTags: ['Promotion'],
    }),
    getTopReferrers: build.query<TopReferrer[], void>({
      query: () => ({ url: '/referrals/top-referrers', params: { top: TOP_REFERRERS } }),
      providesTags: ['Promotion'],
    }),
  }),
});

export const {
  useGetPromotionsQuery,
  useCreatePromotionMutation,
  useUpdatePromotionMutation,
  useSetPromotionActiveMutation,
  useDeletePromotionMutation,
  useGetDiscountsQuery,
  useCreateDiscountMutation,
  useUpdateDiscountMutation,
  useSetDiscountStatusMutation,
  useDeleteDiscountMutation,
  useGetDiscountAnalyticsQuery,
  useGetDiscountUsageQuery,
  useGetPromoCodesQuery,
  useCreatePromoCodeMutation,
  useUpdatePromoCodeMutation,
  useTogglePromoCodeMutation,
  useDeletePromoCodeMutation,
  useGetStoriesQuery,
  useCreateStoryMutation,
  useUpdateStoryMutation,
  useSetStoryStatusMutation,
  useDeleteStoryMutation,
  useGetStoryAnalyticsQuery,
  useGetReferralSettingsQuery,
  useSaveReferralSettingsMutation,
  useGetTopReferrersQuery,
} = promotionsApi;
