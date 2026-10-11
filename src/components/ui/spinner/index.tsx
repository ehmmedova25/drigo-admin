import { cx } from '@/utils/cx';
import styles from './style.module.scss';

export const Spinner = ({ className }: { className?: string }) => {
  return <span className={cx(styles.root, className)} aria-hidden />;
};
