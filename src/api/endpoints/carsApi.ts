import { baseApi } from '@/api/baseApi';
import type { Paged, Query, SuccessResponse } from '@/api/types';
import { PAGE_SIZE } from '@/constants/config';
import type {
  Brand,
  CarColor,
  CarCommand,
  CarDetail,
  CarLastActivity,
  CarListItem,
  CarModel,
  CarPayload,
  CarStatus,
  CarTracking,
  GpsPoint,
  NamedItem,
  ProblematicCar,
} from '@/types/cars.types';

export const carsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCars: build.query<Paged<CarListItem>, Query>({
      query: (params) => ({ url: '/cars', params }),
      providesTags: ['Car'],
    }),
    getCar: build.query<CarDetail, number | string>({
      query: (id) => `/cars/${id}`,
      providesTags: ['Car'],
    }),
    createCar: build.mutation<{ id: number }, CarPayload>({
      query: (body) => ({ url: '/cars', method: 'POST', body }),
      invalidatesTags: ['Car', 'Dashboard', 'Fleet'],
    }),
    updateCar: build.mutation<unknown, { id: number; payload: CarPayload }>({
      query: ({ id, payload }) => ({ url: `/cars/${id}`, method: 'PUT', body: payload }),
      invalidatesTags: ['Car', 'Dashboard', 'Fleet'],
    }),
    deleteCar: build.mutation<SuccessResponse, number>({
      query: (id) => ({ url: `/cars/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Car', 'Dashboard', 'Fleet'],
    }),
    toggleCarActive: build.mutation<{ isActive: boolean }, number>({
      query: (id) => `/cars/${id}/toggle-active`,
      invalidatesTags: ['Car', 'Dashboard', 'Fleet'],
    }),
    getCarStatus: build.query<CarStatus, number | string>({
      query: (id) => `/cars/${id}/status`,
      providesTags: ['Car'],
    }),
    getCarLastActivity: build.query<CarLastActivity, number | string>({
      query: (id) => `/cars/${id}/last-activity`,
      providesTags: ['Car'],
    }),
    getCarGpsPoints: build.query<GpsPoint[], number | string>({
      query: (id) => `/cars/${id}/gps-points`,
      providesTags: ['Car'],
    }),
    getCarCommands: build.query<CarCommand[], void>({
      query: () => '/cars/commands',
    }),
    sendCarCommand: build.mutation<unknown, { id: number; command: string }>({
      query: ({ id, command }) => ({ url: `/cars/${id}/send-command`, method: 'POST', body: { command } }),
      invalidatesTags: ['Car', 'Dashboard', 'Fleet'],
    }),
    getCarTracking: build.query<CarTracking[], void>({
      query: () => '/cars/tracking',
      providesTags: ['Car'],
    }),
    getProblematicCars: build.query<ProblematicCar[], void>({
      query: () => '/cars/problematic',
      providesTags: ['Car'],
    }),
    getCarFuelTypes: build.query<NamedItem[], void>({
      query: () => '/cars/fuel-types',
    }),
    getBrands: build.query<Paged<Brand>, Query>({
      query: (params) => ({ url: '/brands', params }),
      providesTags: ['Brand'],
    }),
    getAllBrands: build.query<Brand[], void>({
      query: () => ({ url: '/brands', params: { pageSize: PAGE_SIZE.lookup } }),
      transformResponse: (res: Paged<Brand>) => res.data,
      providesTags: ['Brand'],
    }),
    createBrand: build.mutation<Brand, string>({
      query: (name) => ({ url: '/brands', method: 'POST', body: { name } }),
      invalidatesTags: ['Brand', 'Car'],
    }),
    deleteBrand: build.mutation<SuccessResponse, number>({
      query: (id) => ({ url: `/brands/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Brand', 'Car'],
    }),
    getBrandModels: build.query<CarModel[], number | string>({
      query: (brandId) => `/brands/${brandId}/models`,
      providesTags: ['Brand'],
    }),
    createBrandModel: build.mutation<CarModel, { brandId: number; name: string }>({
      query: ({ brandId, name }) => ({ url: `/brands/${brandId}/models`, method: 'POST', body: { name } }),
      invalidatesTags: ['Brand', 'Car'],
    }),
    getBrandColors: build.query<CarColor[], number | string>({
      query: (brandId) => `/brands/${brandId}/colors`,
      providesTags: ['Brand'],
    }),
    createBrandColor: build.mutation<CarColor, { brandId: number; name: string; hexCode: string }>({
      query: ({ brandId, name, hexCode }) => ({ url: `/brands/${brandId}/colors`, method: 'POST', body: { name, hexCode } }),
      invalidatesTags: ['Brand', 'Car'],
    }),
  }),
});

export const {
  useGetCarsQuery,
  useGetCarQuery,
  useCreateCarMutation,
  useUpdateCarMutation,
  useDeleteCarMutation,
  useToggleCarActiveMutation,
  useGetCarStatusQuery,
  useGetCarLastActivityQuery,
  useGetCarGpsPointsQuery,
  useGetCarCommandsQuery,
  useSendCarCommandMutation,
  useGetCarTrackingQuery,
  useGetProblematicCarsQuery,
  useGetCarFuelTypesQuery,
  useGetBrandsQuery,
  useGetAllBrandsQuery,
  useCreateBrandMutation,
  useDeleteBrandMutation,
  useGetBrandModelsQuery,
  useCreateBrandModelMutation,
  useGetBrandColorsQuery,
  useCreateBrandColorMutation,
} = carsApi;
