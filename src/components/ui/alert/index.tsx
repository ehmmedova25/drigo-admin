import type { ReactNode } from 'react';
import { cx } from '@/utils/cx';
import styles from './style.module.scss';

export type AlertVariant = 'error' | 'warning' | 'info' | 'success';

export interface AlertProps {
  variant?: AlertVariant;
  children: ReactNode;
  className?: string;
}

export const Alert = ({ variant = 'info', children, className }: AlertProps) => {
  return (
    <div role="alert" className={cx(styles.root, styles[variant], className)}>
      {children}
    </div>
  );
};
