import { Card } from '@/components/ui/card';
import { RESERVATION_PIPELINE } from '@/constants/reservations';
import { cx } from '@/utils/cx';
import styles from './PipelineSteps.module.scss';

export interface PipelineStepsProps {
  status: string;
}

export const PipelineSteps = ({ status }: PipelineStepsProps) => {
  const current = RESERVATION_PIPELINE.indexOf(status);

  return (
    <Card direction="row" gap="xs" align="center" wrap>
      {RESERVATION_PIPELINE.map((step, i) => (
        <span key={step} className={cx(styles.step, i <= current && styles.done, i === current && styles.current)}>
          {step}
        </span>
      ))}
    </Card>
  );
};
