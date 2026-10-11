import type { ComponentProps } from 'react';
import { cx } from '@/utils/cx';
import styles from './style.module.scss';

export type TextareaProps = ComponentProps<'textarea'>;

export const Textarea = ({ className, rows = 3, ...props }: TextareaProps) => {
  return <textarea className={cx(styles.root, className)} rows={rows} {...props} />;
};
