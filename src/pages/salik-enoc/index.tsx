import { useState, type ComponentType } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  useGetEnocSummaryQuery,
  useGetEnocTransactionsQuery,
  useGetSalikScrapeHistoryQuery,
  useGetSalikSummaryQuery,
  useGetSalikTripsQuery,
  useGetScraperStatusQuery,
  useTriggerScraperMutation,
} from '@/api/endpoints/salikEnocApi';
import { CrudTable } from '@/components/common/crud-table';
import { PagedTable } from '@/components/common/data-table';
import { MetricCard } from '@/components/common/metric-card';
import { PageHeader } from '@/components/common/page-header';
import { StatusBadge } from '@/components/common/status-badge';
import { Card } from '@/components/ui/card';
import { Grid } from '@/components/ui/grid';
import { Link } from '@/components/ui/link';
import { Tabs } from '@/components/ui/tabs';
import { EMPTY_VALUE } from '@/constants/config';
import { ROUTES } from '@/constants/paths';
import { SALIK_ENOC_TABS, type SalikEnocTab } from '@/constants/salikEnoc';
import { useAction } from '@/hooks/useAction';
import { usePagedQuery } from '@/hooks/usePagedQuery';
import { formatDateTime, formatMoney, formatNumber } from '@/utils/format';
import { toListState } from '@/utils/queryState';

const carLink = (carId: number, plate: string) => (
  <Link component={RouterLink} to={ROUTES.CAR(carId)}>
    {plate}
  </Link>
);

const rentalLink = (rentalId: number | null) =>
  rentalId ? (
    <Link component={RouterLink} to={ROUTES.RENTAL(rentalId)}>
      #{rentalId}
    </Link>
  ) : (
    EMPTY_VALUE
  );

const SalikTab = () => {
  const { data: summary } = useGetSalikSummaryQuery();
  const list = usePagedQuery(useGetSalikTripsQuery);

  return (
    <>
      {summary && (
        <Grid minItemWidth="sm">
          <MetricCard label="Toll trips" value={formatNumber(summary.totalTrips)} />
          <MetricCard label="Total" value={formatMoney(summary.totalAmount, summary.currency)} />
          <MetricCard label="Billed to customers" value={formatMoney(summary.billedAmount, summary.currency)} />
          <MetricCard label="Not billed yet" value={formatMoney(summary.unbilledAmount, summary.currency)} />
        </Grid>
      )}
      <Card>
        <PagedTable
          list={list}
          rowKey={(t) => t.id}
          emptyText="No toll trips"
          columns={[
            { key: 'date', header: 'Date', render: (t) => formatDateTime(t.tripDate) },
            { key: 'car', header: 'Car', render: (t) => carLink(t.carId, t.plateNumber) },
            { key: 'rental', header: 'Rental', render: (t) => rentalLink(t.rentalId) },
            { key: 'gate', header: 'Gate', render: (t) => t.gate },
            { key: 'amount', header: 'Amount', render: (t) => formatMoney(t.amount, t.currency) },
            { key: 'billed', header: 'Billed', render: (t) => <StatusBadge status={t.billed ? 'Billed' : 'Unpaid'} /> },
          ]}
        />
      </Card>
    </>
  );
};

const EnocTab = () => {
  const { data: summary } = useGetEnocSummaryQuery();
  const list = usePagedQuery(useGetEnocTransactionsQuery);

  return (
    <>
      {summary && (
        <Grid minItemWidth="sm">
          <MetricCard label="Fill-ups" value={formatNumber(summary.totalTransactions)} />
          <MetricCard label="Litres" value={formatNumber(summary.totalLiters)} />
          <MetricCard label="Total spent" value={formatMoney(summary.totalAmount, summary.currency)} />
        </Grid>
      )}
      <Card>
        <PagedTable
          list={list}
          rowKey={(t) => t.id}
          emptyText="No fuel transactions"
          columns={[
            { key: 'date', header: 'Date', render: (t) => formatDateTime(t.transactionDate) },
            { key: 'car', header: 'Car', render: (t) => carLink(t.carId, t.plateNumber) },
            { key: 'rental', header: 'Rental', render: (t) => rentalLink(t.rentalId) },
            { key: 'station', header: 'Station', render: (t) => t.station },
            { key: 'liters', header: 'Litres', render: (t) => formatNumber(t.liters) },
            { key: 'price', header: 'Per litre', render: (t) => formatMoney(t.pricePerLiter, t.currency) },
            { key: 'amount', header: 'Amount', render: (t) => formatMoney(t.amount, t.currency) },
          ]}
        />
      </Card>
    </>
  );
};

const SyncTab = () => {
  const sources = toListState(useGetScraperStatusQuery());
  const history = usePagedQuery(useGetSalikScrapeHistoryQuery);
  const [triggerScraper] = useTriggerScraperMutation();
  const { run } = useAction();

  return (
    <>
      <CrudTable
        list={sources}
        entity="source"
        rowKey={(s) => s.source}
        nameOf={(s) => s.source}
        columns={[
          { key: 'source', header: 'Source', render: (s) => s.source },
          { key: 'status', header: 'Status', render: (s) => <StatusBadge status={s.status} /> },
          { key: 'last', header: 'Last run', render: (s) => formatDateTime(s.lastRunAt) },
        ]}
        rowActions={(s) => [
          {
            label: 'Run now',
            onClick: () => run(() => triggerScraper(s.source).unwrap(), (result) => `${s.source}: ${result.run.itemsFound} new items`),
          },
        ]}
      />
      <Card title="Salik sync history">
        <PagedTable
          list={history}
          rowKey={(h) => h.id}
          emptyText="No runs yet"
          columns={[
            { key: 'source', header: 'Source', render: (h) => h.source },
            { key: 'started', header: 'Started', render: (h) => formatDateTime(h.startedAt) },
            { key: 'finished', header: 'Finished', render: (h) => formatDateTime(h.finishedAt) },
            { key: 'items', header: 'Items found', render: (h) => h.itemsFound },
            { key: 'status', header: 'Result', render: (h) => <StatusBadge status={h.status} /> },
          ]}
        />
      </Card>
    </>
  );
};

const TAB_CONTENT: Record<SalikEnocTab, ComponentType> = {
  'Salik tolls': SalikTab,
  'ENOC fuel': EnocTab,
  'Data sync': SyncTab,
};

const SalikEnoc = () => {
  const [tab, setTab] = useState<SalikEnocTab>(SALIK_ENOC_TABS[0]);
  const Content = TAB_CONTENT[tab];

  return (
    <>
      <PageHeader title="Salik & ENOC" />
      <Tabs tabs={SALIK_ENOC_TABS} active={tab} onChange={setTab} />
      <Content />
    </>
  );
};

export default SalikEnoc;
