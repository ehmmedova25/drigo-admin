import { baseApi } from '@/api/baseApi';
import type { Paged, Query, SuccessResponse } from '@/api/types';
import type { AssignableCar, BookingStatus, ModelPlanSummary, SubscriptionBooking, SubscriptionPlan, SubscriptionPlanPayload } from '@/types/subscriptions.types';

export const subscriptionsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSubscriptionPlans: build.query<SubscriptionPlan[], void>({
      query: () => '/subscription-plans',
      providesTags: ['Subscription'],
    }),
    getSubscriptionPlanModels: build.query<ModelPlanSummary[], void>({
      query: () => '/subscription-plans/models',
      providesTags: ['Subscription'],
    }),
    saveSubscriptionPlan: build.mutation<SubscriptionPlan, { modelId: number; payload: SubscriptionPlanPayload }>({
      query: ({ modelId, payload }) => ({ url: `/subscription-plans/models/${modelId}`, method: 'PUT', body: payload }),
      invalidatesTags: ['Subscription'],
    }),
    deleteSubscriptionPlan: build.mutation<SuccessResponse, number>({
      query: (modelId) => ({ url: `/subscription-plans/models/${modelId}`, method: 'DELETE' }),
      invalidatesTags: ['Subscription'],
    }),
    getSubscriptionBookings: build.query<Paged<SubscriptionBooking>, Query>({
      query: (params) => ({ url: '/subscription-bookings', params }),
      providesTags: ['Subscription'],
    }),
    setSubscriptionBookingStatus: build.mutation<unknown, { id: number; status: BookingStatus }>({
      query: ({ id, status }) => ({ url: `/subscription-bookings/${id}/status`, method: 'PUT', body: { status } }),
      invalidatesTags: ['Subscription'],
    }),
    getSubscriptionAssignableCars: build.query<AssignableCar[], number>({
      query: (modelId) => `/subscription-bookings/assignable-cars/${modelId}`,
      providesTags: ['Subscription', 'Car'],
    }),
    assignSubscriptionBookingCar: build.mutation<unknown, { id: number; carId: number }>({
      query: ({ id, carId }) => ({ url: `/subscription-bookings/${id}/car`, method: 'PUT', body: { carId } }),
      invalidatesTags: ['Subscription', 'Car'],
    }),
  }),
});

export const {
  useGetSubscriptionPlansQuery,
  useGetSubscriptionPlanModelsQuery,
  useSaveSubscriptionPlanMutation,
  useDeleteSubscriptionPlanMutation,
  useGetSubscriptionBookingsQuery,
  useSetSubscriptionBookingStatusMutation,
  useGetSubscriptionAssignableCarsQuery,
  useAssignSubscriptionBookingCarMutation,
} = subscriptionsApi;
