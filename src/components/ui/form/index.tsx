import type { FormHTMLAttributes, ReactNode } from 'react';
import { cx } from '@/utils/cx';
import styles from './style.module.scss';

export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
}

export const Form = ({ className, children, ...props }: FormProps) => {
  return (
    <form className={cx(styles.root, className)} noValidate {...props}>
      {children}
    </form>
  );
};
