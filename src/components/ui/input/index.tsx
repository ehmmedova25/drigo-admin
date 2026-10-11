import { useId, type ComponentProps } from 'react';
import { cx } from '@/utils/cx';
import styles from './style.module.scss';

export interface InputProps extends ComponentProps<'input'> {
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
}

export const Input = ({ className, type = 'text', error, helperText, fullWidth, id, ...props }: InputProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const helperTextId = `${inputId}-helper-text`;

  return (
    <div className={cx(styles.root, fullWidth && styles.fullWidth, error && styles.error, className)}>
      <input
        id={inputId}
        type={type}
        className={styles.input}
        aria-invalid={error || undefined}
        aria-describedby={helperText ? helperTextId : undefined}
        {...props}
      />
      {helperText && (
        <span id={helperTextId} className={styles.helperText}>
          {helperText}
        </span>
      )}
    </div>
  );
};
