import * as yup from 'yup';
import { GEO_ZONE_TYPES } from '@/constants/geo';
import { FORM_MESSAGES } from '@/constants/messages';
import type { GeoZoneType } from '@/types/geo.types';
import { hexColorField, numberField } from '@/utils/validation';

const MAX_LATITUDE = 90;
const MAX_LONGITUDE = 180;

export const geoZoneSchema = yup.object({
  name: yup.string().trim().required(FORM_MESSAGES.REQUIRED),
  type: yup.mixed<GeoZoneType>().oneOf(GEO_ZONE_TYPES).required(FORM_MESSAGES.REQUIRED),
  lat: numberField().min(-MAX_LATITUDE, FORM_MESSAGES.LATITUDE).max(MAX_LATITUDE, FORM_MESSAGES.LATITUDE).required(FORM_MESSAGES.REQUIRED),
  lng: numberField().min(-MAX_LONGITUDE, FORM_MESSAGES.LONGITUDE).max(MAX_LONGITUDE, FORM_MESSAGES.LONGITUDE).required(FORM_MESSAGES.REQUIRED),
  sizeKm: numberField().positive(FORM_MESSAGES.POSITIVE).required(FORM_MESSAGES.REQUIRED),
  color: hexColorField().required(FORM_MESSAGES.REQUIRED),
  isActive: yup.boolean().required(),
});

export type GeoZoneFormValues = yup.InferType<typeof geoZoneSchema>;
