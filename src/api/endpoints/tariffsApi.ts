import { baseApi } from '@/api/baseApi';
import type { SuccessResponse } from '@/api/types';
import type {
  Insurance,
  OverageCharge,
  OverageChargePayload,
  TariffDistance,
  TariffPackage,
  TariffPackagePayload,
  TariffPlan,
  TariffPlanPayload,
  TariffTemplate,
  TariffTemplatePayload,
  TemplateTariff,
} from '@/types/tariffs.types';

export const tariffsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTariffPackages: build.query<TariffPackage[], void>({
      query: () => '/tariff-packages',
      providesTags: ['Tariff'],
    }),
    createTariffPackage: build.mutation<TariffPackage, TariffPackagePayload>({
      query: (body) => ({ url: '/tariff-package', method: 'POST', body }),
      invalidatesTags: ['Tariff'],
    }),
    updateTariffPackage: build.mutation<TariffPackage, { id: number; payload: TariffPackagePayload }>({
      query: ({ id, payload }) => ({ url: `/tariff-packages/${id}`, method: 'PUT', body: payload }),
      invalidatesTags: ['Tariff'],
    }),
    deleteTariffPackage: build.mutation<SuccessResponse, number>({
      query: (id) => ({ url: `/tariff-packages/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Tariff'],
    }),
    getTariffPlans: build.query<TariffPlan[], void>({
      query: () => '/tariff-plans',
      providesTags: ['Tariff'],
    }),
    createTariffPlan: build.mutation<TariffPlan, TariffPlanPayload>({
      query: (body) => ({ url: '/tariff-plans', method: 'POST', body }),
      invalidatesTags: ['Tariff'],
    }),
    updateTariffPlan: build.mutation<TariffPlan, { id: number; payload: TariffPlanPayload }>({
      query: ({ id, payload }) => ({ url: `/tariff-plans/${id}`, method: 'PUT', body: payload }),
      invalidatesTags: ['Tariff'],
    }),
    deleteTariffPlan: build.mutation<SuccessResponse, number>({
      query: (id) => ({ url: `/tariff-plans/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Tariff'],
    }),
    getTariffTemplates: build.query<TariffTemplate[], void>({
      query: () => '/tariff-templates',
      providesTags: ['Tariff'],
    }),
    getTariffTemplate: build.query<TariffTemplate, number>({
      query: (id) => `/tariff-templates/${id}`,
      providesTags: ['Tariff'],
    }),
    createTariffTemplate: build.mutation<TariffTemplate, TariffTemplatePayload>({
      query: (body) => ({ url: '/tariff-templates', method: 'POST', body }),
      invalidatesTags: ['Tariff'],
    }),
    updateTariffTemplate: build.mutation<TariffTemplate, { id: number; payload: TariffTemplatePayload }>({
      query: ({ id, payload }) => ({ url: `/tariff-templates/${id}`, method: 'PUT', body: payload }),
      invalidatesTags: ['Tariff'],
    }),
    deleteTariffTemplate: build.mutation<SuccessResponse, number>({
      query: (id) => ({ url: `/tariff-templates/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Tariff'],
    }),
    toggleTariffTemplate: build.mutation<{ isActive: boolean }, number>({
      query: (id) => ({ url: `/tariff-templates/${id}/toggle`, method: 'PATCH' }),
      invalidatesTags: ['Tariff'],
    }),
    addTemplateTariff: build.mutation<TemplateTariff, { id: number; payload: Omit<TemplateTariff, 'id'> }>({
      query: ({ id, payload }) => ({ url: `/tariff-templates/${id}/tariffs`, method: 'POST', body: payload }),
      invalidatesTags: ['Tariff'],
    }),
    removeTemplateTariff: build.mutation<SuccessResponse, { id: number; tariffId: number }>({
      query: ({ id, tariffId }) => ({ url: `/tariff-templates/${id}/tariffs/${tariffId}`, method: 'DELETE' }),
      invalidatesTags: ['Tariff'],
    }),
    getTariffDistances: build.query<TariffDistance[], void>({
      query: () => '/tariff-distances',
    }),
    getInsurances: build.query<Insurance[], void>({
      query: () => '/insurances',
    }),
    getOverageCharges: build.query<OverageCharge[], void>({
      query: () => '/overage-distance-charges',
      providesTags: ['Tariff'],
    }),
    createOverageCharge: build.mutation<OverageCharge, OverageChargePayload>({
      query: (body) => ({ url: '/overage-distance-charges', method: 'POST', body }),
      invalidatesTags: ['Tariff'],
    }),
    updateOverageCharge: build.mutation<OverageCharge, { id: number; payload: OverageChargePayload }>({
      query: ({ id, payload }) => ({ url: `/overage-distance-charges/${id}`, method: 'PUT', body: payload }),
      invalidatesTags: ['Tariff'],
    }),
    deleteOverageCharge: build.mutation<SuccessResponse, number>({
      query: (id) => ({ url: `/overage-distance-charges/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Tariff'],
    }),
  }),
});

export const {
  useGetTariffPackagesQuery,
  useCreateTariffPackageMutation,
  useUpdateTariffPackageMutation,
  useDeleteTariffPackageMutation,
  useGetTariffPlansQuery,
  useCreateTariffPlanMutation,
  useUpdateTariffPlanMutation,
  useDeleteTariffPlanMutation,
  useGetTariffTemplatesQuery,
  useGetTariffTemplateQuery,
  useCreateTariffTemplateMutation,
  useUpdateTariffTemplateMutation,
  useDeleteTariffTemplateMutation,
  useToggleTariffTemplateMutation,
  useAddTemplateTariffMutation,
  useRemoveTemplateTariffMutation,
  useGetTariffDistancesQuery,
  useGetInsurancesQuery,
  useGetOverageChargesQuery,
  useCreateOverageChargeMutation,
  useUpdateOverageChargeMutation,
  useDeleteOverageChargeMutation,
} = tariffsApi;
