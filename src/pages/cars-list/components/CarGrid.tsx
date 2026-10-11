import { EmptyState } from '@/components/common/empty-state';
import { ErrorState } from '@/components/common/error-state';
import { Loader } from '@/components/common/loader';
import { Pagination } from '@/components/ui/pagination';
import { Stack } from '@/components/ui/stack';
import type { PagedList } from '@/hooks/usePagedQuery';
import type { CarListItem } from '@/types/cars.types';
import { cx } from '@/utils/cx';
import { CarCard } from './CarCard';
import styles from './CarGrid.module.scss';

export interface CarGridProps {
  list: PagedList<CarListItem>;
  onOpen: (id: number) => void;
}

export const CarGrid = ({ list, onOpen }: CarGridProps) => {
  if (list.error) return <ErrorState error={list.error} onRetry={list.reload} />;
  if (list.loading && list.rows.length === 0) return <Loader />;
  if (list.rows.length === 0) return <EmptyState text="No cars found" />;

  return (
    <Stack gap="md">
      <div className={cx(styles.grid, list.loading && styles.dimmed)}>
        {list.rows.map((car) => (
          <CarCard key={car.id} car={car} onOpen={onOpen} />
        ))}
      </div>
      <Pagination page={list.page} pageSize={list.pageSize} total={list.total} onChange={list.setPage} />
    </Stack>
  );
};
