import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAddTemplateTariffMutation, useGetTariffTemplateQuery, useRemoveTemplateTariffMutation } from '@/api/endpoints/tariffsApi';
import { DataTable } from '@/components/common/data-table';
import { ErrorState } from '@/components/common/error-state';
import { FormTextField } from '@/components/common/form-text-field';
import { Loader } from '@/components/common/loader';
import { RowActions } from '@/components/common/row-actions';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Modal } from '@/components/ui/modal';
import { Stack } from '@/components/ui/stack';
import { useAction } from '@/hooks/useAction';
import type { TariffTemplate } from '@/types/tariffs.types';
import { getErrorMessage } from '@/utils/apiError';
import { formatMoney } from '@/utils/format';
import { templateTariffSchema, type TemplateTariffFormValues } from '../tariffs.schema';

export interface TemplateTariffsModalProps {
  template: TariffTemplate;
  onClose: () => void;
}

const EMPTY_TARIFF = { packageName: '', price: undefined };

export const TemplateTariffsModal = ({ template, onClose }: TemplateTariffsModalProps) => {
  const { data, error, refetch } = useGetTariffTemplateQuery(template.id);
  const [addTemplateTariff] = useAddTemplateTariffMutation();
  const [removeTemplateTariff] = useRemoveTemplateTariffMutation();
  const { run, busy } = useAction();

  const form = useForm<TemplateTariffFormValues>({ resolver: yupResolver(templateTariffSchema), defaultValues: EMPTY_TARIFF });

  const add = async (values: TemplateTariffFormValues) => {
    if (await run(() => addTemplateTariff({ id: template.id, payload: values }).unwrap(), 'Tariff added')) form.reset(EMPTY_TARIFF);
  };

  return (
    <Modal title={`Tariffs in "${template.name}"`} onClose={onClose} wide>
      {error ? (
        <ErrorState error={getErrorMessage(error)} onRetry={refetch} />
      ) : !data ? (
        <Loader />
      ) : (
        <DataTable
          rows={data.tariffs}
          rowKey={(tariff) => tariff.id}
          emptyText="No tariffs in this template"
          columns={[
            { key: 'name', header: 'Package', render: (tariff) => tariff.packageName },
            { key: 'price', header: 'Price', render: (tariff) => formatMoney(tariff.price) },
            {
              key: 'actions',
              header: '',
              render: (tariff) => (
                <RowActions
                  actions={[
                    {
                      label: 'Remove',
                      danger: true,
                      onClick: () => run(() => removeTemplateTariff({ id: template.id, tariffId: tariff.id }).unwrap(), 'Tariff removed'),
                    },
                  ]}
                />
              ),
            },
          ]}
        />
      )}
      <Form onSubmit={form.handleSubmit(add)}>
        <Stack direction="row" gap="xs" align="end" wrap>
          <FormTextField name="packageName" control={form.control} label="Package name" placeholder="Package name, e.g. 1 Day" />
          <FormTextField name="price" control={form.control} label="Price" type="number" min={0} step="any" placeholder="Price" />
          <Button type="submit" variant="primary" disabled={busy}>
            Add tariff
          </Button>
        </Stack>
      </Form>
    </Modal>
  );
};
