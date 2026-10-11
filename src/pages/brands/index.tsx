import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCreateBrandMutation, useDeleteBrandMutation, useGetBrandsQuery } from '@/api/endpoints/carsApi';
import { ActionModal } from '@/components/common/action-modal';
import { PagedTable, type Column } from '@/components/common/data-table';
import { FormTextField } from '@/components/common/form-text-field';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Paragraph } from '@/components/ui/paragraph';
import { Stack } from '@/components/ui/stack';
import { useAction } from '@/hooks/useAction';
import { usePagedQuery } from '@/hooks/usePagedQuery';
import type { Brand } from '@/types/cars.types';
import { nameSchema, type NameFormValues } from './brands.schema';
import { BrandCatalogModal } from './components/BrandCatalogModal';

const Brands = () => {
  const list = usePagedQuery(useGetBrandsQuery);
  const [createBrand] = useCreateBrandMutation();
  const [deleteBrand] = useDeleteBrandMutation();
  const { run, busy } = useAction();
  const [toDelete, setToDelete] = useState<Brand | null>(null);
  const [catalogOf, setCatalogOf] = useState<Brand | null>(null);

  const form = useForm({
    resolver: yupResolver(nameSchema),
    defaultValues: { name: '' },
  });

  const create = async ({ name }: NameFormValues) => {
    if (await run(() => createBrand(name).unwrap(), `Brand "${name}" created`)) form.reset();
  };

  const columns: Column<Brand>[] = [
    { key: 'id', header: '#', render: (b) => b.id },
    { key: 'name', header: 'Name', render: (b) => b.name },
    { key: 'cars', header: 'Cars', render: (b) => b.carCount },
    {
      key: 'actions',
      header: '',
      render: (b) => (
        <Stack direction="row" gap="xs" align="center" justify="end" wrap>
          <Button size="sm" onClick={() => setCatalogOf(b)}>
            Models & colors
          </Button>
          <Button size="sm" onClick={() => setToDelete(b)}>
            Delete
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Brands" />
      <Card>
        <Form onSubmit={form.handleSubmit(create)}>
          <Stack direction="row" gap="xs" align="end" wrap>
            <FormTextField name="name" control={form.control} label="New brand" placeholder="New brand name" />
            <Button type="submit" variant="primary" disabled={busy}>
              Add brand
            </Button>
          </Stack>
        </Form>
        <PagedTable list={list} columns={columns} rowKey={(b) => b.id} />
      </Card>
      {toDelete && (
        <ActionModal
          title="Delete brand"
          submitText="Delete"
          successMessage="Brand deleted"
          danger
          onSubmit={() => deleteBrand(toDelete.id).unwrap()}
          onClose={() => setToDelete(null)}
        >
          <Paragraph>Delete "{toDelete.name}"? Brands that still have cars cannot be deleted.</Paragraph>
        </ActionModal>
      )}
      {catalogOf && <BrandCatalogModal brand={catalogOf} onClose={() => setCatalogOf(null)} />}
    </>
  );
};

export default Brands;
