import type { ReactNode } from 'react';
import { Label } from '@/components/ui/label';
import { Span } from '@/components/ui/span';
import styles from './style.module.scss';

export interface FormFieldProps {
  label: string;
  error?: string;
  children: ReactNode;
}

export const FormField = ({ label, error, children }: FormFieldProps) => {
  return (
    <Label className={styles.root}>
      {label}
      {children}
      {error && (
        <Span color="var(--danger)" size="12px" lineHeight="16px">
          {error}
        </Span>
      )}
    </Label>
  );
};
