import { baseApi } from '@/api/baseApi';
import type { Paged, Query } from '@/api/types';
import type { EnocSummary, EnocTransaction, SalikSummary, SalikTrip, ScrapeRun, ScraperSource } from '@/types/salikEnoc.types';

export const salikEnocApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSalikTrips: build.query<Paged<SalikTrip>, Query>({
      query: (params) => ({ url: '/salik/trips', params }),
      providesTags: ['SalikEnoc'],
    }),
    getSalikSummary: build.query<SalikSummary, void>({
      query: () => '/salik/summary',
      providesTags: ['SalikEnoc'],
    }),
    getSalikScrapeHistory: build.query<Paged<ScrapeRun>, Query>({
      query: (params) => ({ url: '/salik/scrape-history', params }),
      providesTags: ['SalikEnoc'],
    }),
    getEnocTransactions: build.query<Paged<EnocTransaction>, Query>({
      query: (params) => ({ url: '/enoc/transactions', params }),
      providesTags: ['SalikEnoc'],
    }),
    getEnocSummary: build.query<EnocSummary, void>({
      query: () => '/enoc/summary',
      providesTags: ['SalikEnoc'],
    }),
    getScraperStatus: build.query<ScraperSource[], void>({
      query: () => '/scraper/status',
      transformResponse: (res: { sources: ScraperSource[]; running: boolean }) => res.sources,
      providesTags: ['SalikEnoc'],
    }),
    triggerScraper: build.mutation<{ run: ScrapeRun }, string>({
      query: (source) => `/scraper/trigger/${encodeURIComponent(source)}`,
      invalidatesTags: ['SalikEnoc'],
    }),
  }),
});

export const {
  useGetSalikTripsQuery,
  useGetSalikSummaryQuery,
  useGetSalikScrapeHistoryQuery,
  useGetEnocTransactionsQuery,
  useGetEnocSummaryQuery,
  useGetScraperStatusQuery,
  useTriggerScraperMutation,
} = salikEnocApi;
