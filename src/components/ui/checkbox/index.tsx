import { cx } from '@/utils/cx';
import styles from './style.module.scss';

export interface CheckboxProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}

export const Checkbox = ({ label, checked, onChange, disabled, className, ariaLabel }: CheckboxProps) => {
  return (
    <label className={cx(styles.root, disabled && styles.disabled, className)}>
      <input
        type="checkbox"
        className={styles.input}
        checked={checked}
        aria-label={ariaLabel}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
      {label}
    </label>
  );
};
