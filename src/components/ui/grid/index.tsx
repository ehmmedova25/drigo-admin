import type { HTMLAttributes } from 'react';
import { cx } from '@/utils/cx';
import type { SpacingToken } from '@/types/style.types';
import styles from './style.module.scss';

export type GridMinWidth = 'sm' | 'md' | 'lg';
export type GridAlign = 'stretch' | 'start';

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  minItemWidth?: GridMinWidth;
  gap?: SpacingToken;
  align?: GridAlign;
}

export const Grid = ({ className, minItemWidth = 'md', gap = 'md', align = 'stretch', ...props }: GridProps) => {
  return <div className={cx(styles.root, styles[minItemWidth], styles[`gap-${gap}`], styles[`align-${align}`], className)} {...props} />;
};
