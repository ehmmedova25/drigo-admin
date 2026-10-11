import type { ReactElement } from 'react';
import { ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';
import { CHART_HEIGHT } from '@/constants/config';

export interface ChartCardProps {
  title: string;
  height?: number;
  children: ReactElement;
}

export const ChartCard = ({ title, height = CHART_HEIGHT, children }: ChartCardProps) => {
  return (
    <Card title={title}>
      <ResponsiveContainer width="100%" height={height}>
        {children}
      </ResponsiveContainer>
    </Card>
  );
};
