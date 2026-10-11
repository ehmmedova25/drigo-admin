import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartCard } from '@/components/common/chart-card';
import { CHART_AXIS, CHART_BAR_MAX_SIZE, CHART_BAR_RADIUS, CHART_COLORS, CHART_GRID, CHART_TOOLTIP } from '@/constants/config';

export interface BarCardProps<T> {
  title: string;
  data: T[];
  labelKey: keyof T & string;
  valueKey: keyof T & string;
  color?: string;
}

export const BarCard = <T,>({ title, data, labelKey, valueKey, color = CHART_COLORS.primary }: BarCardProps<T>) => {
  const rows = data.map((d) => ({ label: String(d[labelKey]), value: Number(d[valueKey]) }));
  return (
    <ChartCard title={title}>
      <BarChart data={rows}>
        <CartesianGrid {...CHART_GRID} />
        <XAxis {...CHART_AXIS} dataKey="label" />
        <YAxis {...CHART_AXIS} allowDecimals={false} />
        <Tooltip {...CHART_TOOLTIP} />
        <Bar dataKey="value" name={valueKey} fill={color} radius={CHART_BAR_RADIUS} maxBarSize={CHART_BAR_MAX_SIZE} />
      </BarChart>
    </ChartCard>
  );
};
