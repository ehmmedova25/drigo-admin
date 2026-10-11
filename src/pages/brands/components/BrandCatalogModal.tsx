import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  useCreateBrandColorMutation,
  useCreateBrandModelMutation,
  useGetBrandColorsQuery,
  useGetBrandModelsQuery,
} from '@/api/endpoints/carsApi';
import { FormTextField } from '@/components/common/form-text-field';
import { Loader } from '@/components/common/loader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Heading } from '@/components/ui/heading';
import { Modal } from '@/components/ui/modal';
import { Span } from '@/components/ui/span';
import { Stack } from '@/components/ui/stack';
import { Swatch } from '@/components/ui/swatch';
import { useAction } from '@/hooks/useAction';
import type { Brand } from '@/types/cars.types';
import { brandColorSchema, nameSchema, type BrandColorFormValues, type NameFormValues } from '../brands.schema';
import styles from './BrandCatalogModal.module.scss';

const DEFAULT_COLOR_HEX = '#000000';

export interface BrandCatalogModalProps {
  brand: Brand;
  onClose: () => void;
}

export const BrandCatalogModal = ({ brand, onClose }: BrandCatalogModalProps) => {
  const { data: models } = useGetBrandModelsQuery(brand.id);
  const { data: colors } = useGetBrandColorsQuery(brand.id);
  const [createModel] = useCreateBrandModelMutation();
  const [createColor] = useCreateBrandColorMutation();
  const { run, busy } = useAction();

  const modelForm = useForm({
    resolver: yupResolver(nameSchema),
    defaultValues: { name: '' },
  });
  const colorForm = useForm({
    resolver: yupResolver(brandColorSchema),
    defaultValues: { name: '', hexCode: DEFAULT_COLOR_HEX },
  });

  const addModel = async ({ name }: NameFormValues) => {
    if (await run(() => createModel({ brandId: brand.id, name }).unwrap(), 'Model added')) modelForm.reset();
  };
  const addColor = async ({ name, hexCode }: BrandColorFormValues) => {
    if (await run(() => createColor({ brandId: brand.id, name, hexCode }).unwrap(), 'Color added')) {
      colorForm.reset({ name: '', hexCode });
    }
  };

  return (
    <Modal title={`${brand.name}: models & colors`} onClose={onClose}>
      {!models || !colors ? (
        <Loader />
      ) : (
        <>
          <Stack gap="sm">
            <Heading as="h3" size="15px" lineHeight="22px" weight="500">
              Models
            </Heading>
            <Stack gap="xs">
              {models.map((m) => (
                <Card
                  key={m.id}
                  gap="2xs"
                  className={styles.item}
                  title={m.name}
                  subtitle={`${m.bodyType?.name} · ${m.seats} seats · ${m.maxSpeed} km/h`}
                />
              ))}
            </Stack>
            <Form onSubmit={modelForm.handleSubmit(addModel)}>
              <Stack direction="row" gap="xs" align="end" wrap>
                <FormTextField name="name" control={modelForm.control} label="New model" placeholder="Model name" />
                <Button type="submit" disabled={busy}>
                  Add model
                </Button>
              </Stack>
            </Form>
          </Stack>
          <Stack gap="sm">
            <Heading as="h3" size="15px" lineHeight="22px" weight="500">
              Colors
            </Heading>
            <Stack gap="xs">
              {colors.map((c) => (
                <Card key={c.id} direction="row" align="center" gap="xs" className={styles.item}>
                  <Swatch color={c.hexCode} />
                  <Span color="var(--text-primary)">{c.name}</Span>
                </Card>
              ))}
            </Stack>
            <Form onSubmit={colorForm.handleSubmit(addColor)}>
              <Stack direction="row" gap="xs" align="end" wrap>
                <FormTextField name="name" control={colorForm.control} label="New color" placeholder="Color name" />
                <FormTextField name="hexCode" control={colorForm.control} label="Hex" type="color" />
                <Button type="submit" disabled={busy}>
                  Add color
                </Button>
              </Stack>
            </Form>
          </Stack>
        </>
      )}
    </Modal>
  );
};
