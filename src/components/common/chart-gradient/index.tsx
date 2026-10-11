import { CHART_AREA_OPACITY } from '@/constants/config';

export interface ChartGradientProps {
  id: string;
  color: string;
}

export const ChartGradient = ({ id, color }: ChartGradientProps) => {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity={CHART_AREA_OPACITY.from} />
        <stop offset="100%" stopColor={color} stopOpacity={CHART_AREA_OPACITY.to} />
      </linearGradient>
    </defs>
  );
};
