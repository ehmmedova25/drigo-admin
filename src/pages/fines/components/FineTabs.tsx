import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  useGetCarFinesQuery,
  useGetFinesByCarQuery,
  useGetFinesForReviewQuery,
  useGetFinesQuery,
  useGetScraperFinesQuery,
} from '@/api/endpoints/finesApi';
import { DataTable, PagedTable, type Column } from '@/components/common/data-table';
import { Loader } from '@/components/common/loader';
import { StatusBadge } from '@/components/common/status-badge';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from '@/components/ui/link';
import { Modal } from '@/components/ui/modal';
import { Paragraph } from '@/components/ui/paragraph';
import { Select } from '@/components/ui/select';
import { Span } from '@/components/ui/span';
import { Stack } from '@/components/ui/stack';
import { EMPTY_VALUE } from '@/constants/config';
import { FINE_STATUSES, OPEN_FINE_STATUSES } from '@/constants/fines';
import { COMMON_MESSAGES } from '@/constants/messages';
import { ROUTES } from '@/constants/paths';
import { usePagedQuery } from '@/hooks/usePagedQuery';
import type { CarFinesSummary, Fine, FineDecision } from '@/types/fines.types';
import { getErrorMessage } from '@/utils/apiError';
import { formatDateTime, formatMoney, orDash } from '@/utils/format';
import { toListState } from '@/utils/queryState';
import { BillCustomerModal, FineDecisionModal, NewFineModal } from './FineModals';

type ModalState = { kind: 'new' } | { kind: 'billCustomer'; fine: Fine } | { kind: 'decision'; fine: Fine; decision: FineDecision };

const useFineTable = () => {
  const [modal, setModal] = useState<ModalState | null>(null);
  const decide = (fine: Fine, decision: FineDecision) => setModal({ kind: 'decision', fine, decision });

  const columns: Column<Fine>[] = [
    { key: 'ref', header: 'Reference', render: (f) => f.referenceNumber },
    { key: 'type', header: 'Type', render: (f) => f.type },
    {
      key: 'car',
      header: 'Car',
      render: (f) =>
        f.carId ? (
          <Link component={RouterLink} to={ROUTES.CAR(f.carId)}>
            {f.plateNumber ?? f.carId}
          </Link>
        ) : (
          EMPTY_VALUE
        ),
    },
    {
      key: 'rental',
      header: 'Rental',
      render: (f) =>
        f.rentalId ? (
          <Link component={RouterLink} to={ROUTES.RENTAL(f.rentalId)}>
            #{f.rentalId}
          </Link>
        ) : (
          EMPTY_VALUE
        ),
    },
    { key: 'amount', header: 'Amount', render: (f) => formatMoney(f.amount, f.currency) },
    { key: 'date', header: 'Date', render: (f) => formatDateTime(f.fineDate) },
    { key: 'status', header: 'Status', render: (f) => <StatusBadge status={f.status} /> },
    { key: 'billed', header: 'Billed to', render: (f) => orDash(f.billedTo) },
    {
      key: 'actions',
      header: '',
      render: (f) =>
        OPEN_FINE_STATUSES.includes(f.status) ? (
          <Stack direction="row" gap="xs" align="center">
            <Button size="sm" variant="primary" onClick={() => setModal({ kind: 'billCustomer', fine: f })}>
              Bill customer
            </Button>
            <Button size="sm" onClick={() => decide(f, 'bill-company')}>
              Bill company
            </Button>
            <Button size="sm" onClick={() => decide(f, 'dismiss')}>
              Dismiss
            </Button>
          </Stack>
        ) : (
          f.status === 'Billed' && (
            <Button size="sm" onClick={() => decide(f, 'unbill')}>
              Unbill
            </Button>
          )
        ),
    },
  ];

  const props = { onClose: () => setModal(null) };
  const modals = (
    <>
      {modal?.kind === 'new' && <NewFineModal {...props} />}
      {modal?.kind === 'billCustomer' && <BillCustomerModal fine={modal.fine} {...props} />}
      {modal?.kind === 'decision' && <FineDecisionModal fine={modal.fine} decision={modal.decision} {...props} />}
    </>
  );

  return { columns, modals, openNew: () => setModal({ kind: 'new' }) };
};

export const AllFinesTab = () => {
  const [status, setStatus] = useState('');
  const list = usePagedQuery(useGetFinesQuery, { status });
  const { columns, modals, openNew } = useFineTable();

  return (
    <Card>
      <Stack direction="row" gap="xs" align="center" justify="between" wrap>
        <Select value={status} onChange={setStatus} options={FINE_STATUSES} placeholder={COMMON_MESSAGES.ALL_STATUSES} />
        <Button variant="primary" onClick={openNew}>
          New fine
        </Button>
      </Stack>
      <PagedTable list={list} columns={columns} rowKey={(f) => f.id} emptyText="No fines" />
      {modals}
    </Card>
  );
};

export const ReviewTab = () => {
  const { rows, loading, error, reload } = toListState(useGetFinesForReviewQuery());
  const { columns, modals } = useFineTable();

  return (
    <Card>
      <DataTable
        rows={rows}
        loading={loading}
        error={error}
        onRetry={reload}
        columns={columns}
        rowKey={(f) => f.id}
        emptyText="Nothing waiting for review"
      />
      {modals}
    </Card>
  );
};

export const ScraperTab = () => {
  const list = usePagedQuery(useGetScraperFinesQuery, {});
  const { columns, modals } = useFineTable();

  return (
    <Card>
      <PagedTable list={list} columns={columns} rowKey={(f) => f.id} emptyText="No scraped fines" />
      {modals}
    </Card>
  );
};

const carColumns: Column<CarFinesSummary>[] = [
  { key: 'car', header: 'Car', render: (c) => `${c.carName} · ${c.plateNumber}` },
  { key: 'count', header: 'Fines', render: (c) => c.totalFines },
  { key: 'unpaid', header: 'Unpaid', render: (c) => c.unpaidCount },
  { key: 'amount', header: 'Total', render: (c) => formatMoney(c.totalAmount, c.currency) },
  { key: 'sync', header: 'Last sync', render: (c) => formatDateTime(c.lastSyncedAt) },
];

export interface CarFinesModalProps {
  carId: number;
  onClose: () => void;
}

const CarFinesModal = ({ carId, onClose }: CarFinesModalProps) => {
  const { data, error } = useGetCarFinesQuery(carId);

  return (
    <Modal title={data ? `${data.carName} · ${data.plateNumber}` : 'Car fines'} onClose={onClose} wide>
      {error && <Alert variant="error">{getErrorMessage(error)}</Alert>}
      {!data && !error && <Loader />}
      {data && (
        <>
          <Paragraph>
            Total: <Span color="var(--text-primary)" weight="500">{formatMoney(data.totalAmount)}</Span> ·{' '}
            <Link component={RouterLink} to={ROUTES.CAR(data.carId)}>
              Open car
            </Link>
          </Paragraph>
          <DataTable
            rows={data.fines}
            rowKey={(f) => f.id}
            emptyText="No fines for this car"
            columns={[
              { key: 'ref', header: 'Reference', render: (f) => f.referenceNumber },
              { key: 'type', header: 'Type', render: (f) => f.type },
              { key: 'amount', header: 'Amount', render: (f) => formatMoney(f.amount, f.currency) },
              { key: 'date', header: 'Date', render: (f) => formatDateTime(f.fineDate) },
              { key: 'status', header: 'Status', render: (f) => <StatusBadge status={f.status} /> },
            ]}
          />
        </>
      )}
    </Modal>
  );
};

export const ByCarTab = () => {
  const list = usePagedQuery(useGetFinesByCarQuery, {});
  const [carId, setCarId] = useState<number | null>(null);

  return (
    <Card>
      <PagedTable list={list} columns={carColumns} rowKey={(c) => c.carId} onRowClick={(c) => setCarId(c.carId)} emptyText="No fines" />
      {carId !== null && <CarFinesModal carId={carId} onClose={() => setCarId(null)} />}
    </Card>
  );
};
