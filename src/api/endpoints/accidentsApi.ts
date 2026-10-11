import { baseApi } from '@/api/baseApi';
import type { Paged, Query, SuccessResponse } from '@/api/types';
import type { Accident, AccidentPayload } from '@/types/accidents.types';

export const accidentsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAccidents: build.query<Paged<Accident>, Query>({
      query: (params) => ({ url: '/accidents', params }),
      providesTags: ['Accident'],
    }),
    createAccident: build.mutation<Accident, AccidentPayload>({
      query: (body) => ({ url: '/accidents', method: 'POST', body }),
      invalidatesTags: ['Accident'],
    }),
    updateAccident: build.mutation<Accident, { id: number; payload: AccidentPayload }>({
      query: ({ id, payload }) => ({ url: `/accidents/${id}`, method: 'PUT', body: payload }),
      invalidatesTags: ['Accident'],
    }),
    deleteAccident: build.mutation<SuccessResponse, number>({
      query: (id) => ({ url: `/accidents/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Accident'],
    }),
  }),
});

export const { useGetAccidentsQuery, useCreateAccidentMutation, useUpdateAccidentMutation, useDeleteAccidentMutation } = accidentsApi;
