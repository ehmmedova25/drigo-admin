import { Button } from '@/components/ui/button';
import { Paragraph } from '@/components/ui/paragraph';
import { Stack } from '@/components/ui/stack';
import styles from './style.module.scss';

export interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
}

export const ErrorState = ({ error, onRetry }: ErrorStateProps) => {
  return (
    <Stack align="center" gap="sm" className={styles.root}>
      <Paragraph align="center" color="var(--danger)" weight="400">
        {error}
      </Paragraph>
      {onRetry && <Button onClick={onRetry}>Retry</Button>}
    </Stack>
  );
};
