import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCreateGeoZoneMutation, useUpdateGeoZoneMutation } from '@/api/endpoints/geoApi';
import { FormCheckboxField } from '@/components/common/form-checkbox-field';
import { FormSelectField } from '@/components/common/form-select-field';
import { FormTextField } from '@/components/common/form-text-field';
import { FormModal } from '@/components/common/form-modal';
import { DEFAULT_GEO_ZONE, GEO_ZONE_TYPES } from '@/constants/geo';
import type { CrudFormProps } from '@/hooks/useCrudModals';
import type { GeoZone, GeoZonePayload } from '@/types/geo.types';
import { polygonBox, squarePolygon } from '@/utils/polygon';
import { geoZoneSchema, type GeoZoneFormValues } from '../geo.schema';

const SIZE_DECIMALS = 2;

const toPayload = (values: GeoZoneFormValues): GeoZonePayload => ({
  name: values.name,
  type: values.type,
  color: values.color,
  isActive: values.isActive,
  polygon: squarePolygon({ lat: values.lat, lng: values.lng }, values.sizeKm),
});

export const GeoZoneFormModal = ({ item, onClose }: CrudFormProps<GeoZone>) => {
  const [createGeoZone] = useCreateGeoZoneMutation();
  const [updateGeoZone] = useUpdateGeoZoneMutation();
  const box = (item && polygonBox(item.polygon)) || DEFAULT_GEO_ZONE;

  const form = useForm({
    resolver: yupResolver(geoZoneSchema),
    defaultValues: {
      name: item?.name ?? '',
      type: item?.type ?? GEO_ZONE_TYPES[0],
      color: item?.color ?? DEFAULT_GEO_ZONE.color,
      isActive: item?.isActive ?? true,
      lat: box.center.lat,
      lng: box.center.lng,
      sizeKm: Number(box.sizeKm.toFixed(SIZE_DECIMALS)),
    },
  });

  const save = (values: GeoZoneFormValues) => {
    const payload = toPayload(values);
    return item ? updateGeoZone({ id: item.id, payload }).unwrap() : createGeoZone(payload).unwrap();
  };

  return (
    <FormModal
      title={item ? 'Edit geo zone' : 'New geo zone'}
      submitText="Save"
      successMessage={item ? 'Geo zone updated' : 'Geo zone created'}
      form={form}
      onSubmit={save}
      onClose={onClose}
    >
      <FormTextField name="name" control={form.control} label="Name" />
      <FormSelectField name="type" control={form.control} label="Type" options={GEO_ZONE_TYPES} />
      <FormTextField name="lat" control={form.control} label="Center latitude" type="number" step="any" />
      <FormTextField name="lng" control={form.control} label="Center longitude" type="number" step="any" />
      <FormTextField name="sizeKm" control={form.control} label="Size (km per side)" type="number" min={0} step="any" />
      <FormTextField name="color" control={form.control} label="Color on map" type="color" />
      <FormCheckboxField name="isActive" control={form.control} label="Active" />
    </FormModal>
  );
};
