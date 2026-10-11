import type { HTMLAttributes } from 'react';
import { cx } from '@/utils/cx';
import type { SpacingToken } from '@/types/style.types';
import styles from './style.module.scss';

export type StackDirection = 'row' | 'column';
export type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  direction?: StackDirection;
  gap?: SpacingToken;
  align?: StackAlign;
  justify?: StackJustify;
  wrap?: boolean;
}

export const Stack = ({ className, direction = 'column', gap, align, justify, wrap, ...props }: StackProps) => {
  const rootClassName = cx(
    styles.root,
    styles[direction],
    gap !== undefined && styles[`gap-${gap}`],
    align !== undefined && styles[`align-${align}`],
    justify !== undefined && styles[`justify-${justify}`],
    wrap && styles.wrap,
    className,
  );

  return <div className={rootClassName} {...props} />;
};
