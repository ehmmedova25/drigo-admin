import { cx } from '@/utils/cx';
import styles from './style.module.scss';

export type SelectOption = string | { value: string | number; label: string };

export interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: readonly SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export const Select = ({ value, onChange, options, placeholder, disabled, fullWidth, className }: SelectProps) => {
  return (
    <select
      className={cx(styles.root, fullWidth && styles.fullWidth, className)}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
    >
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {options.map((option) =>
        typeof option === 'string' ? (
          <option key={option} value={option}>
            {option}
          </option>
        ) : (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ),
      )}
    </select>
  );
};
