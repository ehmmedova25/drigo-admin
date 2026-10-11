import type { LabelHTMLAttributes } from 'react';
import { cx } from '@/utils/cx';
import styles from './style.module.scss';

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export const Label = ({ className, ...props }: LabelProps) => {
  return <label className={cx(styles.root, className)} {...props} />;
};
