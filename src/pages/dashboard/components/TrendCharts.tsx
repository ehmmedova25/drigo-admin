import { Area, AreaChart, Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartCard } from '@/components/common/chart-card';
import { ChartGradient } from '@/components/common/chart-gradient';
import { Grid } from '@/components/ui/grid';
import { CHART_AXIS, CHART_BAR_MAX_SIZE, CHART_BAR_RADIUS, CHART_COLORS, CHART_GRID, CHART_TOOLTIP } from '@/constants/config';
import type { Trends } from '@/types/dashboard.types';
import { formatShortDate } from '@/utils/format';

export interface TrendChartsProps {
  trends: Trends;
}

export const TrendCharts = ({ trends }: TrendChartsProps) => {
  const activity = trends.rentalTrends.map((rental, index) => ({
    date: formatShortDate(rental.date),
    rentals: rental.count,
    reservations: trends.reservationTrends[index]?.count ?? 0,
  }));
  const revenue = trends.revenueTrends.map((day) => ({ date: formatShortDate(day.date), revenue: day.revenue }));

  return (
    <Grid>
      <ChartCard title={`Rentals & reservations (${activity.length} days)`}>
        <BarChart data={activity}>
          <CartesianGrid {...CHART_GRID} />
          <XAxis {...CHART_AXIS} dataKey="date" />
          <YAxis {...CHART_AXIS} allowDecimals={false} />
          <Tooltip {...CHART_TOOLTIP} />
          <Bar dataKey="rentals" fill={CHART_COLORS.primary} radius={CHART_BAR_RADIUS} maxBarSize={CHART_BAR_MAX_SIZE} />
          <Bar dataKey="reservations" fill={CHART_COLORS.light} radius={CHART_BAR_RADIUS} maxBarSize={CHART_BAR_MAX_SIZE} />
        </BarChart>
      </ChartCard>
      <ChartCard title={`Revenue (${revenue.length} days)`}>
        <AreaChart data={revenue}>
          <CartesianGrid {...CHART_GRID} />
          <XAxis {...CHART_AXIS} dataKey="date" />
          <YAxis {...CHART_AXIS} />
          <Tooltip {...CHART_TOOLTIP} />
          <ChartGradient id="revenueGradient" color={CHART_COLORS.primary} />
          <Area type="monotone" dataKey="revenue" stroke={CHART_COLORS.primary} strokeWidth={3} fill="url(#revenueGradient)" dot={false} />
        </AreaChart>
      </ChartCard>
    </Grid>
  );
};
