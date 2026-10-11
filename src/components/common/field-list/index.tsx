import type { ReactNode } from 'react';
import styles from './style.module.scss';

export const FieldList = ({ items }: { items: [label: string, value: ReactNode][] }) => {
  return (
    <dl className={styles.root}>
      {items.map(([label, value]) => (
        <div key={label} className={styles.row}>
          <dt className={styles.label}>{label}</dt>
          <dd className={styles.value}>{value ?? '—'}</dd>
        </div>
      ))}
    </dl>
  );
};
