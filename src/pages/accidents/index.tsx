import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useDeleteAccidentMutation, useGetAccidentsQuery } from '@/api/endpoints/accidentsApi';
import { ActionModal } from '@/components/common/action-modal';
import { PagedTable, type Column } from '@/components/common/data-table';
import { PageHeader } from '@/components/common/page-header';
import { StatusBadge } from '@/components/common/status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from '@/components/ui/link';
import { Paragraph } from '@/components/ui/paragraph';
import { Select } from '@/components/ui/select';
import { Stack } from '@/components/ui/stack';
import { ACCIDENT_STATUSES } from '@/constants/accidents';
import { EMPTY_VALUE } from '@/constants/config';
import { COMMON_MESSAGES } from '@/constants/messages';
import { ROUTES } from '@/constants/paths';
import { useCrudModals } from '@/hooks/useCrudModals';
import { usePagedQuery } from '@/hooks/usePagedQuery';
import type { Accident } from '@/types/accidents.types';
import { formatDateTime, formatMoney } from '@/utils/format';
import { AccidentFormModal } from './components/AccidentFormModal';

const Accidents = () => {
  const [status, setStatus] = useState('');
  const list = usePagedQuery(useGetAccidentsQuery, { status });
  const [deleteAccident] = useDeleteAccidentMutation();
  const crud = useCrudModals<Accident>();
  const { deleting } = crud;

  const columns: Column<Accident>[] = [
    { key: 'id', header: '#', render: (a) => a.id },
    { key: 'date', header: 'Date', render: (a) => formatDateTime(a.accidentDate) },
    {
      key: 'car',
      header: 'Car',
      render: (a) =>
        a.carId ? (
          <Link component={RouterLink} to={ROUTES.CAR(a.carId)}>
            #{a.carId}
          </Link>
        ) : (
          EMPTY_VALUE
        ),
    },
    {
      key: 'rental',
      header: 'Rental',
      render: (a) =>
        a.rentalId ? (
          <Link component={RouterLink} to={ROUTES.RENTAL(a.rentalId)}>
            #{a.rentalId}
          </Link>
        ) : (
          EMPTY_VALUE
        ),
    },
    { key: 'fault', header: 'Fault', render: (a) => a.faultParty },
    { key: 'cost', header: 'Est. cost', render: (a) => formatMoney(a.estimatedCost, a.currency) },
    { key: 'status', header: 'Status', render: (a) => <StatusBadge status={a.status} /> },
    {
      key: 'actions',
      header: '',
      render: (a) => (
        <Stack direction="row" gap="xs" align="center">
          <Button size="sm" onClick={() => crud.edit(a)}>
            Edit
          </Button>
          <Button size="sm" onClick={() => crud.remove(a)}>
            Delete
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Accidents"
        actions={
          <Button variant="primary" onClick={crud.create}>
            Report accident
          </Button>
        }
      />
      <Card>
        <Stack direction="row" gap="xs" align="center" wrap>
          <Select value={status} onChange={setStatus} options={ACCIDENT_STATUSES} placeholder={COMMON_MESSAGES.ALL_STATUSES} />
        </Stack>
        <PagedTable list={list} columns={columns} rowKey={(a) => a.id} emptyText="No accidents" />
      </Card>
      {crud.isFormOpen && <AccidentFormModal accident={crud.formItem} onClose={crud.close} />}
      {deleting && (
        <ActionModal
          title="Delete accident"
          submitText="Delete"
          successMessage="Accident deleted"
          danger
          onSubmit={() => deleteAccident(deleting.id).unwrap()}
          onClose={crud.close}
        >
          <Paragraph>Delete accident #{deleting.id}?</Paragraph>
        </ActionModal>
      )}
    </>
  );
};

export default Accidents;
