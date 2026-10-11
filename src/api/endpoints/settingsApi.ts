import { baseApi } from '@/api/baseApi';
import type { SuccessResponse } from '@/api/types';
import type {
  BlockedCountry,
  BlockedIp,
  ExcessKmCharge,
  PenaltyConfig,
  PenaltyConfigPayload,
  ServiceFee,
  ServiceFeePayload,
  SmsCountryMode,
  TripFee,
} from '@/types/settings.types';

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getServiceFees: build.query<ServiceFee[], void>({
      query: () => '/service-fees',
      providesTags: ['Settings'],
    }),
    createServiceFee: build.mutation<ServiceFee, ServiceFeePayload>({
      query: (body) => ({ url: '/service-fees', method: 'POST', body }),
      invalidatesTags: ['Settings'],
    }),
    updateServiceFee: build.mutation<ServiceFee, { id: number; payload: ServiceFeePayload }>({
      query: ({ id, payload }) => ({ url: `/service-fees/${id}`, method: 'PUT', body: payload }),
      invalidatesTags: ['Settings'],
    }),
    getTripFee: build.query<TripFee, void>({
      query: () => '/trip-fee',
      providesTags: ['Settings'],
    }),
    saveTripFee: build.mutation<TripFee, Pick<TripFee, 'amount' | 'isActive'>>({
      query: (body) => ({ url: '/trip-fee', method: 'PUT', body }),
      invalidatesTags: ['Settings'],
    }),
    getExcessKmCharge: build.query<ExcessKmCharge, void>({
      query: () => '/excess-km-charge',
      providesTags: ['Settings'],
    }),
    saveExcessKmCharge: build.mutation<ExcessKmCharge, Pick<ExcessKmCharge, 'pricePerKm' | 'isActive'>>({
      query: (body) => ({ url: '/excess-km-charge', method: 'PUT', body }),
      invalidatesTags: ['Settings'],
    }),
    getPenaltyConfigs: build.query<PenaltyConfig[], void>({
      query: () => '/penalty-configs',
      providesTags: ['Settings'],
    }),
    createPenaltyConfig: build.mutation<PenaltyConfig, PenaltyConfigPayload>({
      query: (body) => ({ url: '/penalty-configs', method: 'POST', body }),
      invalidatesTags: ['Settings'],
    }),
    updatePenaltyConfig: build.mutation<PenaltyConfig, { id: number; payload: PenaltyConfigPayload }>({
      query: ({ id, payload }) => ({ url: `/penalty-configs/${id}`, method: 'PUT', body: payload }),
      invalidatesTags: ['Settings'],
    }),
    getBlockedIps: build.query<BlockedIp[], void>({
      query: () => '/security/blocked-ips',
      providesTags: ['Settings'],
    }),
    blockIp: build.mutation<SuccessResponse, { entry: string; reason: string }>({
      query: ({ entry, reason }) => ({ url: '/security/block-ip', method: 'POST', body: { entry, reason } }),
      invalidatesTags: ['Settings'],
    }),
    unblockIp: build.mutation<SuccessResponse, string>({
      query: (entry) => ({ url: `/security/block-ip/${encodeURIComponent(entry)}`, method: 'DELETE' }),
      invalidatesTags: ['Settings'],
    }),
    getBlockedCountries: build.query<BlockedCountry[], void>({
      query: () => '/security/blocked-country-codes',
      providesTags: ['Settings'],
    }),
    blockCountry: build.mutation<SuccessResponse, { countryCode: string; reason: string }>({
      query: ({ countryCode, reason }) => ({ url: '/security/block-country-code', method: 'POST', body: { countryCode, reason } }),
      invalidatesTags: ['Settings'],
    }),
    unblockCountry: build.mutation<SuccessResponse, string>({
      query: (code) => ({ url: `/security/block-country-code/${encodeURIComponent(code)}`, method: 'DELETE' }),
      invalidatesTags: ['Settings'],
    }),
    getSmsCountryMode: build.query<SmsCountryMode, void>({
      query: () => '/security/sms-country-mode',
      providesTags: ['Settings'],
    }),
    saveSmsCountries: build.mutation<SmsCountryMode, string[]>({
      query: (countries) => ({ url: '/security/sms-country-mode', method: 'POST', body: { countries } }),
      invalidatesTags: ['Settings'],
    }),
  }),
});

export const {
  useGetServiceFeesQuery,
  useCreateServiceFeeMutation,
  useUpdateServiceFeeMutation,
  useGetTripFeeQuery,
  useSaveTripFeeMutation,
  useGetExcessKmChargeQuery,
  useSaveExcessKmChargeMutation,
  useGetPenaltyConfigsQuery,
  useCreatePenaltyConfigMutation,
  useUpdatePenaltyConfigMutation,
  useGetBlockedIpsQuery,
  useBlockIpMutation,
  useUnblockIpMutation,
  useGetBlockedCountriesQuery,
  useBlockCountryMutation,
  useUnblockCountryMutation,
  useGetSmsCountryModeQuery,
  useSaveSmsCountriesMutation,
} = settingsApi;
