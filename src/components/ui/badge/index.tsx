import type { ReactNode } from 'react';
import { cx } from '@/utils/cx';
import type { Tone } from '@/types/style.types';
import styles from './style.module.scss';

export interface BadgeProps {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}

export const Badge = ({ tone = 'neutral', children, className }: BadgeProps) => {
  return <span className={cx(styles.root, styles[tone], className)}>{children}</span>;
};
