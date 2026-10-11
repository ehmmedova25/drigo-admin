import { Card } from '@/components/ui/card';
import { cx } from '@/utils/cx';
import styles from './style.module.scss';

export type MetricTone = 'default' | 'accent' | 'lavender' | 'lilac' | 'sky' | 'rose';

export interface MetricCardProps {
  label: string;
  value: string | number;
  tone?: MetricTone;
}

export const MetricCard = ({ label, value, tone = 'default' }: MetricCardProps) => {
  return (
    <Card gap="xs" className={cx(styles.root, styles[tone])}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
    </Card>
  );
};
