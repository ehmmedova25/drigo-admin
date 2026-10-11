import { useState, type ComponentType } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  useGetFleetMovesQuery,
  useGetFleetPlanQuery,
  useGetFleetUtilizationByCarQuery,
  useGetFleetUtilizationSummaryQuery,
} from '@/api/endpoints/fleetApi';
import { DataTable, PagedTable } from '@/components/common/data-table';
import { ErrorState } from '@/components/common/error-state';
import { Loader } from '@/components/common/loader';
import { MetricCard } from '@/components/common/metric-card';
import { PageHeader } from '@/components/common/page-header';
import { StatusBadge } from '@/components/common/status-badge';
import { Card } from '@/components/ui/card';
import { Grid } from '@/components/ui/grid';
import { Link } from '@/components/ui/link';
import { Tabs } from '@/components/ui/tabs';
import { FLEET_TABS, type FleetTab } from '@/constants/fleet';
import { ROUTES } from '@/constants/paths';
import { usePagedQuery } from '@/hooks/usePagedQuery';
import { getErrorMessage } from '@/utils/apiError';
import { carState } from '@/utils/carState';
import { formatDateTime, formatMoney, formatNumber, formatPercent } from '@/utils/format';
import { toListState } from '@/utils/queryState';
import { CityTargetsCard } from './components/CityTargetsCard';

const TargetsTab = () => {
  const { data, isLoading, error, refetch } = useGetFleetPlanQuery();

  if (isLoading) return <Loader />;
  if (error || !data) return <ErrorState error={getErrorMessage(error)} onRetry={refetch} />;

  return <CityTargetsCard key={data.updatedAt} plan={data} />;
};

const MovesTab = () => {
  const list = toListState(useGetFleetMovesQuery());

  return (
    <Card>
      <DataTable
        rows={list.rows}
        loading={list.loading}
        error={list.error}
        onRetry={list.reload}
        rowKey={(move) => move.id}
        emptyText="No car moves planned"
        columns={[
          {
            key: 'car',
            header: 'Car',
            render: (move) => (
              <Link component={RouterLink} to={ROUTES.CAR(move.carId)}>
                {move.plateNumber}
              </Link>
            ),
          },
          { key: 'route', header: 'From / to', render: (move) => `${move.fromCity} to ${move.toCity}` },
          { key: 'who', header: 'Assigned to', render: (move) => move.assignedTo },
          { key: 'when', header: 'Scheduled', render: (move) => formatDateTime(move.scheduledAt) },
          { key: 'status', header: 'Status', render: (move) => <StatusBadge status={move.status} /> },
        ]}
      />
    </Card>
  );
};

const UtilizationTab = () => {
  const { data: summary } = useGetFleetUtilizationSummaryQuery();
  const list = usePagedQuery(useGetFleetUtilizationByCarQuery);

  return (
    <>
      {summary && (
        <Grid minItemWidth="sm">
          <MetricCard label="Utilization" value={formatPercent(summary.utilizationRate)} />
          <MetricCard label="Rented now / idle" value={`${summary.activeCars} / ${summary.idleCars}`} />
          <MetricCard label="Revenue" value={formatMoney(summary.totalRevenue, summary.currency)} />
          <MetricCard label="Revenue per car" value={formatMoney(summary.avgRevenuePerCar, summary.currency)} />
          <MetricCard label="Distance driven" value={`${formatNumber(summary.totalDistance)} km`} />
        </Grid>
      )}
      <Card>
        <PagedTable
          list={list}
          rowKey={(car) => car.carId}
          columns={[
            {
              key: 'car',
              header: 'Car',
              render: (car) => (
                <Link component={RouterLink} to={ROUTES.CAR(car.carId)}>
                  {car.plateNumber}
                </Link>
              ),
            },
            { key: 'name', header: 'Model', render: (car) => car.carName },
            { key: 'rentals', header: 'Rentals', render: (car) => car.rentalCount },
            { key: 'distance', header: 'Distance', render: (car) => `${formatNumber(car.totalDistance)} km` },
            { key: 'revenue', header: 'Revenue', render: (car) => formatMoney(car.revenue) },
            { key: 'state', header: 'State', render: (car) => <StatusBadge status={carState(car.isActive, car.currentlyRented)} /> },
          ]}
        />
      </Card>
    </>
  );
};

const TAB_CONTENT: Record<FleetTab, ComponentType> = {
  'City targets': TargetsTab,
  'Car moves': MovesTab,
  Utilization: UtilizationTab,
};

const Fleet = () => {
  const [tab, setTab] = useState<FleetTab>(FLEET_TABS[0]);
  const Content = TAB_CONTENT[tab];

  return (
    <>
      <PageHeader title="Fleet planning" />
      <Tabs tabs={FLEET_TABS} active={tab} onChange={setTab} />
      <Content />
    </>
  );
};

export default Fleet;
