import { useState } from 'react';
import { useGetMonthlyReportQuery, useGetReportStatisticsQuery } from '@/api/endpoints/reportsApi';
import { DataTable, type Column } from '@/components/common/data-table';
import { ErrorState } from '@/components/common/error-state';
import { Loader } from '@/components/common/loader';
import { MetricCard } from '@/components/common/metric-card';
import { PageHeader } from '@/components/common/page-header';
import { Card } from '@/components/ui/card';
import { Grid } from '@/components/ui/grid';
import { Select } from '@/components/ui/select';
import { Span } from '@/components/ui/span';
import { DEFAULT_MONTH_RANGE, MONTH_RANGE_OPTIONS } from '@/constants/reports';
import type { MonthRow } from '@/types/reports.types';
import { getErrorMessage } from '@/utils/apiError';
import { formatMoney } from '@/utils/format';
import { combineQueries } from '@/utils/queryState';
import { MonthDetailModal } from './components/MonthDetailModal';
import { RevenueChart } from './components/RevenueChart';

const COLUMNS: Column<MonthRow>[] = [
  { key: 'month', header: 'Month', render: (m) => m.month },
  { key: 'rental', header: 'Rental revenue', render: (m) => formatMoney(m.revenue.rental) },
  { key: 'extraKm', header: 'Extra km', render: (m) => formatMoney(m.revenue.extraKm) },
  { key: 'rentals', header: 'Rentals', render: (m) => m.rentals.total },
  { key: 'salik', header: 'Salik', render: (m) => formatMoney(m.salik.total) },
  { key: 'enoc', header: 'ENOC', render: (m) => formatMoney(m.enoc.total) },
  { key: 'fines', header: 'Fines billed', render: (m) => formatMoney(m.fines.billedTotal) },
  { key: 'debt', header: 'Debt added / collected', render: (m) => `${formatMoney(m.debt.added)} / ${formatMoney(m.debt.collected)}` },
  {
    key: 'net',
    header: 'Net',
    render: (m) => (
      <Span weight={600} color="var(--text-primary)">
        {formatMoney(m.netRevenue)}
      </Span>
    ),
  },
];

const MonthlyReport = () => {
  const [months, setMonths] = useState(DEFAULT_MONTH_RANGE);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const reportQuery = useGetMonthlyReportQuery(months);
  const statsQuery = useGetReportStatisticsQuery();
  const { error, reload } = combineQueries([reportQuery, statsQuery]);

  const report = reportQuery.data;
  const stats = statsQuery.data;

  if (error) return <ErrorState error={getErrorMessage(error)} onRetry={reload} />;
  if (!report || !stats) return <Loader />;

  return (
    <>
      <PageHeader
        title="Monthly report"
        actions={<Select value={String(months)} onChange={(v) => setMonths(Number(v))} options={MONTH_RANGE_OPTIONS} />}
      />

      <Grid minItemWidth="sm">
        <MetricCard label="Revenue (all time)" value={formatMoney(stats.revenue.total)} />
        <MetricCard label="Rentals (all time)" value={stats.rentals.total} />
        <MetricCard label="Fleet utilization" value={`${stats.fleet.utilizationRate}%`} />
        <MetricCard label="Unpaid debt" value={formatMoney(stats.debt.unpaid)} />
        <MetricCard label={`Net revenue (${months} mo)`} value={formatMoney(report.totals.netRevenue)} />
      </Grid>

      <RevenueChart months={report.months} />

      <Card title="By month" subtitle="Click a month for details.">
        <DataTable columns={COLUMNS} rows={report.months} rowKey={(m) => m.month} onRowClick={(m) => setSelectedMonth(m.month)} />
      </Card>

      {selectedMonth && <MonthDetailModal month={selectedMonth} onClose={() => setSelectedMonth(null)} />}
    </>
  );
};

export default MonthlyReport;
