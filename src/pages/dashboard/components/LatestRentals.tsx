import { Link as RouterLink } from 'react-router-dom';
import { useGetRentalsQuery } from '@/api/endpoints/rentalsApi';
import { CarVisual } from '@/components/common/car-visual';
import { EmptyState } from '@/components/common/empty-state';
import { ErrorState } from '@/components/common/error-state';
import { Loader } from '@/components/common/loader';
import { StatusBadge } from '@/components/common/status-badge';
import { Card } from '@/components/ui/card';
import { Link } from '@/components/ui/link';
import { Span } from '@/components/ui/span';
import { PAGE_SIZE } from '@/constants/config';
import { ROUTES } from '@/constants/paths';
import { RENTAL_SORT_OPTIONS } from '@/constants/rentals';
import { getErrorMessage } from '@/utils/apiError';
import { formatDateTime, formatMoney } from '@/utils/format';
import { SORT_ORDER_OPTIONS } from '@/utils/sorting';
import styles from './LatestRentals.module.scss';

export const LatestRentals = () => {
  const { data, error, isLoading, refetch } = useGetRentalsQuery({
    page: 1,
    pageSize: PAGE_SIZE.preview,
    sortBy: RENTAL_SORT_OPTIONS[0].value,
    sortOrder: SORT_ORDER_OPTIONS[0].value,
  });

  return (
    <Card
      title="Latest rentals"
      action={
        <Link component={RouterLink} to={ROUTES.RENTALS}>
          View all
        </Link>
      }
    >
      {error ? (
        <ErrorState error={getErrorMessage(error)} onRetry={refetch} />
      ) : isLoading || !data ? (
        <Loader />
      ) : data.data.length === 0 ? (
        <EmptyState text="No rentals yet" />
      ) : (
        <div className={styles.list}>
          {data.data.map((rental) => (
            <RouterLink key={rental.id} to={ROUTES.RENTAL(rental.id)} className={styles.item}>
              <div className={styles.thumb}>
                <CarVisual brand={rental.car.brand} model={rental.car.model} compact />
              </div>
              <div className={styles.info}>
                <span className={styles.name}>
                  {rental.car.brand} {rental.car.model}
                </span>
                <Span size="12px">
                  {rental.user.fullName} · {formatDateTime(rental.startDate)}
                </Span>
              </div>
              <div className={styles.meta}>
                <span className={styles.price}>{formatMoney(rental.totalPaid)}</span>
                <StatusBadge status={rental.status} />
              </div>
            </RouterLink>
          ))}
        </div>
      )}
    </Card>
  );
};
