import { useState } from 'react';
import {
  useGetCustomerFunnelQuery,
  useGetDebtBreakdownQuery,
  useGetDemographicsQuery,
  useGetFleetHealthQuery,
} from '@/api/endpoints/analyticsApi';
import { ErrorState } from '@/components/common/error-state';
import { Loader } from '@/components/common/loader';
import { MetricCard } from '@/components/common/metric-card';
import { PageHeader } from '@/components/common/page-header';
import { Grid } from '@/components/ui/grid';
import { Select } from '@/components/ui/select';
import { DAY_RANGE_OPTIONS, DEFAULT_DAY_RANGE } from '@/constants/analytics';
import { CHART_COLORS } from '@/constants/config';
import type { CustomerFunnel, DebtBreakdown, Demographics, FleetHealth } from '@/types/analytics.types';
import { getErrorMessage } from '@/utils/apiError';
import { formatMoney } from '@/utils/format';
import { combineQueries } from '@/utils/queryState';
import { BarCard } from './components/BarCard';
import { DailyCharts } from './components/DailyCharts';

interface SnapshotProps {
  debt: DebtBreakdown;
  funnel: CustomerFunnel;
  demographics: Demographics;
  fleet: FleetHealth;
}

const Snapshot = ({ debt, funnel, demographics, fleet }: SnapshotProps) => (
  <>
    <Grid minItemWidth="sm">
      <MetricCard label="Unpaid debt" value={formatMoney(debt.total, debt.currency)} />
      <MetricCard label="Customers with debt" value={debt.debtorCount} />
      <MetricCard label="Open problem reports" value={fleet.openProblemReports} />
      <MetricCard label="Open accidents" value={fleet.openAccidents} />
    </Grid>
    <Grid>
      <BarCard title="Unpaid debt by type" data={debt.byType} labelKey="type" valueKey="amount" color={CHART_COLORS.deep} />
      <BarCard title="Unpaid debt by age" data={debt.buckets} labelKey="label" valueKey="amount" color={CHART_COLORS.light} />
      <BarCard title="Customer funnel" data={funnel.steps} labelKey="step" valueKey="count" />
      <BarCard title={`Fleet condition (${fleet.total} cars)`} data={fleet.conditions} labelKey="condition" valueKey="count" color={CHART_COLORS.medium} />
      <BarCard title="Customers by age" data={demographics.age} labelKey="range" valueKey="count" />
      <BarCard title="Customers by gender" data={demographics.gender} labelKey="gender" valueKey="count" color={CHART_COLORS.light} />
      <BarCard title="Customers by platform" data={demographics.platform} labelKey="platform" valueKey="count" color={CHART_COLORS.medium} />
    </Grid>
  </>
);

const Analytics = () => {
  const [days, setDays] = useState<number>(DEFAULT_DAY_RANGE);
  const debtQuery = useGetDebtBreakdownQuery();
  const funnelQuery = useGetCustomerFunnelQuery();
  const demographicsQuery = useGetDemographicsQuery();
  const fleetQuery = useGetFleetHealthQuery();
  const snapshot = combineQueries([debtQuery, funnelQuery, demographicsQuery, fleetQuery]);

  const debt = debtQuery.data;
  const funnel = funnelQuery.data;
  const demographics = demographicsQuery.data;
  const fleet = fleetQuery.data;

  return (
    <>
      <PageHeader
        title="Analytics"
        actions={<Select value={String(days)} onChange={(v) => setDays(Number(v))} options={DAY_RANGE_OPTIONS} />}
      />
      <DailyCharts days={days} />
      {snapshot.error ? (
        <ErrorState error={getErrorMessage(snapshot.error)} onRetry={snapshot.reload} />
      ) : !debt || !funnel || !demographics || !fleet ? (
        <Loader />
      ) : (
        <Snapshot debt={debt} funnel={funnel} demographics={demographics} fleet={fleet} />
      )}
    </>
  );
};

export default Analytics;
