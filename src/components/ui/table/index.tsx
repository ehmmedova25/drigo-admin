import type { ReactNode } from 'react';
import { cx } from '@/utils/cx';
import styles from './style.module.scss';

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
}

export interface TableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string | number;
  onRowClick?: (row: T) => void;
  dimmed?: boolean;
}

export const Table = <T,>({ columns, rows, rowKey, onRowClick, dimmed }: TableProps<T>) => {
  return (
    <div className={cx(styles.root, dimmed && styles.dimmed)}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={styles.th}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              className={cx(styles.tr, onRowClick && styles.clickable)}
              onClick={onRowClick && (() => onRowClick(row))}
            >
              {columns.map((column) => (
                <td key={column.key} className={styles.td}>
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
