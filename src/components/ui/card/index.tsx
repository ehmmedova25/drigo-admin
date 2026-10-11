import type { ReactNode } from 'react';
import { Stack, type StackProps } from '@/components/ui/stack';
import { cx } from '@/utils/cx';
import styles from './style.module.scss';

export interface CardProps extends Omit<StackProps, 'title'> {
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  children?: ReactNode;
}

export const Card = ({ title, subtitle, action, className, gap = 'sm', children, ...props }: CardProps) => {
  const hasHeader = Boolean(title || subtitle || action);

  return (
    <Stack className={cx(styles.root, className)} gap={gap} {...props}>
      {hasHeader && (
        <Stack direction="row" align="center" justify="between" gap="sm" wrap>
          <Stack className={styles.main}>
            {title && <span className={styles.title}>{title}</span>}
            {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
          </Stack>
          {action}
        </Stack>
      )}

      {children}
    </Stack>
  );
};
