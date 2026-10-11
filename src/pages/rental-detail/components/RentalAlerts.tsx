import { Alert } from '@/components/ui/alert';
import { Span } from '@/components/ui/span';
import type { RentalDetail } from '@/types/rentals.types';
import { formatDateTime, formatMoney } from '@/utils/format';

export interface RentalAlertsProps {
  rental: RentalDetail;
}

export const RentalAlerts = ({ rental }: RentalAlertsProps) => {
  const retry = rental.paymentRetryState;

  return (
    <>
      {retry && (
        <Alert variant="warning">
          <Span color="inherit" weight="500">
            Payment stuck.
          </Span>{' '}
          Last error: {retry.lastError} · attempts: {retry.attempts} · amount due: {formatMoney(retry.amountDue)} · next automatic
          retry: {formatDateTime(retry.nextRetryAt)}. Retry the failed payment below, or collect the debt on the customer page.
        </Alert>
      )}
      {rental.cancelReason && <Alert variant="info">Cancel reason: {rental.cancelReason}</Alert>}
    </>
  );
};
