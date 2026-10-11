import type { ReactNode } from 'react';
import styles from './style.module.scss';

export interface CodeProps {
  children: ReactNode;
}

export const Code = ({ children }: CodeProps) => {
  return <code className={styles.root}>{children}</code>;
};
