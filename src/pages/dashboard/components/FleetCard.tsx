import { Link as RouterLink } from 'react-router-dom';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '@/components/ui/card';
import { Link } from '@/components/ui/link';
import { Span } from '@/components/ui/span';
import { Stack } from '@/components/ui/stack';
import { Swatch } from '@/components/ui/swatch';
import { CHART_COLORS, CHART_DONUT, CHART_TOOLTIP } from '@/constants/config';
import { ROUTES } from '@/constants/paths';
import type { FleetSummary } from '@/types/dashboard.types';
import styles from './FleetCard.module.scss';

export interface FleetCardProps {
  fleet: FleetSummary;
}

export const FleetCard = ({ fleet }: FleetCardProps) => {
  const states = [
    { name: 'Available', value: fleet.available, color: CHART_COLORS.primary },
    { name: 'Rented', value: fleet.rented, color: CHART_COLORS.medium },
    { name: 'Inactive', value: fleet.inactive, color: CHART_COLORS.light },
  ];
  const extras = [
    { name: 'Online', value: fleet.online },
    { name: 'Low fuel', value: fleet.lowFuel },
    ...fleet.byCity.map((city) => ({ name: city.city, value: city.count })),
  ];

  return (
    <Card
      title="Fleet"
      gap="md"
      action={
        <Link component={RouterLink} to={ROUTES.TRACKING}>
          Open live map
        </Link>
      }
    >
      <div className={styles.overview}>
        <div className={styles.donut}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={states}
                dataKey="value"
                nameKey="name"
                innerRadius={CHART_DONUT.inner}
                outerRadius={CHART_DONUT.outer}
                paddingAngle={CHART_DONUT.padding}
                stroke="none"
              >
                {states.map((state) => (
                  <Cell key={state.name} fill={state.color} />
                ))}
              </Pie>
              <Tooltip {...CHART_TOOLTIP} />
            </PieChart>
          </ResponsiveContainer>
          <div className={styles.total}>
            <span className={styles.totalValue}>{fleet.total}</span>
            <Span size="12px">Cars</Span>
          </div>
        </div>
        <Stack gap="sm" className={styles.legend}>
          {states.map((state) => (
            <Stack key={state.name} direction="row" align="center" justify="between" gap="sm">
              <Stack direction="row" align="center" gap="xs">
                <Swatch color={state.color} />
                <Span>{state.name}</Span>
              </Stack>
              <Span color="var(--text-primary)" weight="500">
                {state.value}
              </Span>
            </Stack>
          ))}
        </Stack>
      </div>
      <div className={styles.extras}>
        {extras.map((extra) => (
          <div key={extra.name} className={styles.extra}>
            <Span size="12px">{extra.name}</Span>
            <span className={styles.extraValue}>{extra.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};
