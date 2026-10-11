import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '@/utils/cx';
import styles from './style.module.scss';

export type ButtonVariant = 'primary' | 'outline' | 'danger' | 'text' | 'ghost';
export type ButtonSize = 'md' | 'sm';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

export const Button = ({
  className,
  variant = 'outline',
  size = 'md',
  fullWidth,
  startIcon,
  endIcon,
  children,
  type = 'button',
  ...props
}: ButtonProps) => {
  const rootClassName = cx(styles.root, styles[variant], styles[size], fullWidth && styles.fullWidth, className);

  return (
    <button type={type} className={rootClassName} {...props}>
      {startIcon && <span className={styles.icon}>{startIcon}</span>}
      {children}
      {endIcon && <span className={styles.icon}>{endIcon}</span>}
    </button>
  );
};
