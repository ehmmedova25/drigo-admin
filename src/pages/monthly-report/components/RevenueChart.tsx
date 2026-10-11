import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartCard } from '@/components/common/chart-card';
import { CHART_AXIS, CHART_BAR_MAX_SIZE, CHART_BAR_RADIUS, CHART_COLORS, CHART_GRID, CHART_TOOLTIP, CURRENCY } from '@/constants/config';
import type { MonthRow } from '@/types/reports.types';

const REVENUE_CHART_HEIGHT = 280;

export interface RevenueChartProps {
  months: MonthRow[];
}

export const RevenueChart = ({ months }: RevenueChartProps) => {
  const data = months.map((m) => ({
    month: m.month,
    Revenue: m.revenue.total,
    'Operating cost': m.operatingCost,
    Net: m.netRevenue,
  }));

  return (
    <ChartCard title={`Revenue vs cost (${CURRENCY})`} height={REVENUE_CHART_HEIGHT}>
      <BarChart data={data}>
        <CartesianGrid {...CHART_GRID} />
        <XAxis {...CHART_AXIS} dataKey="month" />
        <YAxis {...CHART_AXIS} />
        <Tooltip {...CHART_TOOLTIP} />
        <Legend />
        <Bar dataKey="Revenue" fill={CHART_COLORS.primary} radius={CHART_BAR_RADIUS} maxBarSize={CHART_BAR_MAX_SIZE} />
        <Bar dataKey="Operating cost" fill={CHART_COLORS.deep} radius={CHART_BAR_RADIUS} maxBarSize={CHART_BAR_MAX_SIZE} />
        <Bar dataKey="Net" fill={CHART_COLORS.medium} radius={CHART_BAR_RADIUS} maxBarSize={CHART_BAR_MAX_SIZE} />
      </BarChart>
    </ChartCard>
  );
};
