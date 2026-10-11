import { baseApi } from '@/api/baseApi';
import type { Paged, Query, SuccessResponse } from '@/api/types';
import type {
  Audience,
  Campaign,
  CampaignPayload,
  CampaignStatus,
  HistoryItem,
  MobileText,
  NotificationMessage,
  ScheduledNotification,
  ScheduledPayload,
  SendResult,
} from '@/types/notifications.types';

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    sendBroadcastNotification: build.mutation<SendResult, NotificationMessage>({
      query: (body) => ({ url: '/notifications/broadcast', method: 'POST', body }),
      invalidatesTags: ['Notification'],
    }),
    previewNotificationAudience: build.query<{ estimatedRecipients: number }, Audience>({
      query: (targetAudience) => ({ url: '/notifications/preview-target', method: 'POST', body: { targetAudience } }),
    }),
    sendVerificationReminder: build.mutation<SendResult, void>({
      query: () => ({ url: '/notifications/send-verification-reminder', method: 'POST' }),
      invalidatesTags: ['Notification'],
    }),
    sendMissingDocumentReminder: build.mutation<SendResult, void>({
      query: () => ({ url: '/notifications/send-missing-document', method: 'POST' }),
      invalidatesTags: ['Notification'],
    }),
    getCampaigns: build.query<Paged<Campaign>, Query>({
      query: (params) => ({ url: '/notifications/campaigns', params }),
      providesTags: ['Notification'],
    }),
    createCampaign: build.mutation<Campaign, CampaignPayload>({
      query: (body) => ({ url: '/notifications/campaigns', method: 'POST', body }),
      invalidatesTags: ['Notification'],
    }),
    updateCampaign: build.mutation<Campaign, { id: number; payload: CampaignPayload }>({
      query: ({ id, payload }) => ({ url: `/notifications/campaigns/${id}`, method: 'PUT', body: payload }),
      invalidatesTags: ['Notification'],
    }),
    setCampaignStatus: build.mutation<unknown, { id: number; status: CampaignStatus }>({
      query: ({ id, status }) => ({ url: `/notifications/campaigns/${id}/status`, method: 'PATCH', body: { status } }),
      invalidatesTags: ['Notification'],
    }),
    executeCampaign: build.mutation<SendResult, number>({
      query: (id) => ({ url: `/notifications/campaigns/${id}/execute`, method: 'POST' }),
      invalidatesTags: ['Notification'],
    }),
    deleteCampaign: build.mutation<SuccessResponse, number>({
      query: (id) => ({ url: `/notifications/campaigns/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Notification'],
    }),
    getScheduledNotifications: build.query<ScheduledNotification[], void>({
      query: () => '/notifications/scheduled',
      providesTags: ['Notification'],
    }),
    createScheduledNotification: build.mutation<ScheduledNotification, ScheduledPayload>({
      query: (body) => ({ url: '/notifications/scheduled', method: 'POST', body }),
      invalidatesTags: ['Notification'],
    }),
    deleteScheduledNotification: build.mutation<SuccessResponse, number>({
      query: (id) => ({ url: `/notifications/scheduled/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Notification'],
    }),
    getNotificationHistory: build.query<Paged<HistoryItem>, Query>({
      query: (params) => ({ url: '/notifications/history', params }),
      providesTags: ['Notification'],
    }),
    getMobileTexts: build.query<MobileText[], void>({
      query: () => '/mobileHomeTexts',
      providesTags: ['Notification'],
    }),
    updateMobileText: build.mutation<MobileText, { id: number; value: string }>({
      query: ({ id, value }) => ({ url: `/mobileHomeTexts/${id}`, method: 'PUT', body: { value } }),
      invalidatesTags: ['Notification'],
    }),
  }),
});

export const {
  useSendBroadcastNotificationMutation,
  usePreviewNotificationAudienceQuery,
  useSendVerificationReminderMutation,
  useSendMissingDocumentReminderMutation,
  useGetCampaignsQuery,
  useCreateCampaignMutation,
  useUpdateCampaignMutation,
  useSetCampaignStatusMutation,
  useExecuteCampaignMutation,
  useDeleteCampaignMutation,
  useGetScheduledNotificationsQuery,
  useCreateScheduledNotificationMutation,
  useDeleteScheduledNotificationMutation,
  useGetNotificationHistoryQuery,
  useGetMobileTextsQuery,
  useUpdateMobileTextMutation,
} = notificationsApi;
