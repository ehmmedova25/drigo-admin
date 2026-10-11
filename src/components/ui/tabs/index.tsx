import { Button } from '@/components/ui/button';
import { cx } from '@/utils/cx';
import styles from './style.module.scss';

export interface TabsProps<T extends string> {
  tabs: readonly T[];
  active: T;
  onChange: (tab: T) => void;
}

export const Tabs = <T extends string>({ tabs, active, onChange }: TabsProps<T>) => {
  return (
    <div className={styles.root} role="tablist">
      {tabs.map((tab) => (
        <Button
          key={tab}
          variant="ghost"
          role="tab"
          aria-selected={tab === active}
          className={cx(styles.tab, tab === active && styles.active)}
          onClick={() => onChange(tab)}
        >
          {tab}
        </Button>
      ))}
    </div>
  );
};
