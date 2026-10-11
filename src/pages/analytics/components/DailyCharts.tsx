import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts';
import { useGetDebtDailyQuery, useGetRevenueDailyQuery, useGetUtilizationDailyQuery } from '@/api/endpoints/analyticsApi';
import { ChartCard } from '@/components/common/chart-card';
import { ChartGradient } from '@/components/common/chart-gradient';
import { ErrorState } from '@/components/common/error-state';
import { Loader } from '@/components/common/loader';
import { Grid } from '@/components/ui/grid';
import { CHART_AXIS, CHART_BAR_MAX_SIZE, CHART_BAR_RADIUS, CHART_COLORS, CHART_GRID, CHART_TOOLTIP, CURRENCY } from '@/constants/config';
import { getErrorMessage } from '@/utils/apiError';
import { formatShortDate } from '@/utils/format';
import { combineQueries } from '@/utils/queryState';

export interface DailyChartsProps {
  days: number;
}

export const DailyCharts = ({ days }: DailyChartsProps) => {
  const revenueQuery = useGetRevenueDailyQuery(days);
  const utilizationQuery = useGetUtilizationDailyQuery(days);
  const debtQuery = useGetDebtDailyQuery(days);
  const { error, reload } = combineQueries([revenueQuery, utilizationQuery, debtQuery]);

  const revenue = revenueQuery.data?.points;
  const utilization = utilizationQuery.data?.points;
  const debt = debtQuery.data?.points;

  if (error) return <ErrorState error={getErrorMessage(error)} onRetry={reload} />;
  if (!revenue || !utilization || !debt) return <Loader />;

  return (
    <>
      <Grid>
        <ChartCard title={`Revenue per day (${CURRENCY})`}>
          <AreaChart data={revenue}>
            <CartesianGrid {...CHART_GRID} />
            <XAxis {...CHART_AXIS} dataKey="date" tickFormatter={formatShortDate} />
            <YAxis {...CHART_AXIS} />
            <Tooltip {...CHART_TOOLTIP} />
            <ChartGradient id="revenueGradient" color={CHART_COLORS.primary} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke={CHART_COLORS.primary}
              strokeWidth={3}
              fill="url(#revenueGradient)"
              dot={false}
            />
          </AreaChart>
        </ChartCard>
        <ChartCard title="Fleet utilization (%)">
          <AreaChart data={utilization}>
            <CartesianGrid {...CHART_GRID} />
            <XAxis {...CHART_AXIS} dataKey="date" tickFormatter={formatShortDate} />
            <YAxis {...CHART_AXIS} unit="%" />
            <Tooltip {...CHART_TOOLTIP} />
            <ChartGradient id="utilizationGradient" color={CHART_COLORS.primary} />
            <Area
              type="monotone"
              dataKey="utilization"
              stroke={CHART_COLORS.primary}
              strokeWidth={3}
              fill="url(#utilizationGradient)"
              dot={false}
            />
          </AreaChart>
        </ChartCard>
      </Grid>
      <ChartCard title={`Debt added vs collected (${CURRENCY})`}>
        <BarChart data={debt}>
          <CartesianGrid {...CHART_GRID} />
          <XAxis {...CHART_AXIS} dataKey="date" tickFormatter={formatShortDate} />
          <YAxis {...CHART_AXIS} />
          <Tooltip {...CHART_TOOLTIP} />
          <Legend />
          <Bar dataKey="added" fill={CHART_COLORS.deep} radius={CHART_BAR_RADIUS} maxBarSize={CHART_BAR_MAX_SIZE} />
          <Bar dataKey="collected" fill={CHART_COLORS.medium} radius={CHART_BAR_RADIUS} maxBarSize={CHART_BAR_MAX_SIZE} />
        </BarChart>
      </ChartCard>
    </>
  );
};
