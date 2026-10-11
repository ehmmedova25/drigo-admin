import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useCancelCleaningMutation, useGetCleaningStatsQuery, useGetCleaningsQuery } from '@/api/endpoints/operationsApi';
import { CrudTable } from '@/components/common/crud-table';
import { MetricCard } from '@/components/common/metric-card';
import { StatusBadge } from '@/components/common/status-badge';
import { Grid } from '@/components/ui/grid';
import { Link } from '@/components/ui/link';
import { Select } from '@/components/ui/select';
import { COMMON_MESSAGES } from '@/constants/messages';
import { CANCELLABLE_CLEANING, CLEANING_STATUSES } from '@/constants/operations';
import { ROUTES } from '@/constants/paths';
import { useAction } from '@/hooks/useAction';
import { usePagedQuery } from '@/hooks/usePagedQuery';
import { formatDateTime, formatMoney, orDash } from '@/utils/format';

export const CleaningsTab = () => {
  const [status, setStatus] = useState('');
  const list = usePagedQuery(useGetCleaningsQuery, { status });
  const { data: stats } = useGetCleaningStatsQuery();
  const [cancelCleaning] = useCancelCleaningMutation();
  const { run } = useAction();

  return (
    <>
      {stats && (
        <Grid minItemWidth="sm">
          <MetricCard label="Cleanings" value={stats.total} />
          {CLEANING_STATUSES.map((cleaningStatus) => (
            <MetricCard key={cleaningStatus} label={cleaningStatus} value={stats.byStatus[cleaningStatus] ?? 0} />
          ))}
          <MetricCard label="Total cost" value={formatMoney(stats.totalCost, stats.currency)} />
        </Grid>
      )}
      <CrudTable
        list={list}
        entity="cleaning"
        rowKey={(cleaning) => cleaning.id}
        nameOf={(cleaning) => `#${cleaning.id}`}
        toolbar={<Select value={status} onChange={setStatus} options={CLEANING_STATUSES} placeholder={COMMON_MESSAGES.ALL_STATUSES} />}
        columns={[
          { key: 'when', header: 'Scheduled', render: (cleaning) => formatDateTime(cleaning.scheduledAt) },
          {
            key: 'car',
            header: 'Car',
            render: (cleaning) => (
              <Link component={RouterLink} to={ROUTES.CAR(cleaning.carId)}>
                {cleaning.plateNumber}
              </Link>
            ),
          },
          { key: 'model', header: 'Model', render: (cleaning) => cleaning.carName },
          { key: 'type', header: 'Type', render: (cleaning) => cleaning.type },
          { key: 'who', header: 'Assigned to', render: (cleaning) => orDash(cleaning.assignedTo) },
          { key: 'cost', header: 'Cost', render: (cleaning) => formatMoney(cleaning.cost, cleaning.currency) },
          { key: 'status', header: 'Status', render: (cleaning) => <StatusBadge status={cleaning.status} /> },
        ]}
        rowActions={(cleaning) =>
          CANCELLABLE_CLEANING.includes(cleaning.status)
            ? [{ label: 'Cancel', danger: true, onClick: () => run(() => cancelCleaning(cleaning.id).unwrap(), 'Cleaning cancelled') }]
            : []
        }
      />
    </>
  );
};
