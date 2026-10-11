import { useGetMonthReportQuery } from '@/api/endpoints/reportsApi';
import { ErrorState } from '@/components/common/error-state';
import { FieldList } from '@/components/common/field-list';
import { Loader } from '@/components/common/loader';
import { Modal } from '@/components/ui/modal';
import { Span } from '@/components/ui/span';
import { getErrorMessage } from '@/utils/apiError';
import { formatMoney, formatNumber } from '@/utils/format';

export interface MonthDetailModalProps {
  month: string;
  onClose: () => void;
}

export const MonthDetailModal = ({ month, onClose }: MonthDetailModalProps) => {
  const { data: m, error, isLoading, refetch } = useGetMonthReportQuery(month);

  return (
    <Modal title={`Report ${month}`} onClose={onClose}>
      {isLoading ? (
        <Loader />
      ) : error || !m ? (
        <ErrorState error={getErrorMessage(error)} onRetry={refetch} />
      ) : (
        <FieldList
          items={[
            ['Rental revenue', formatMoney(m.revenue.rental)],
            ['Extra km revenue', formatMoney(m.revenue.extraKm)],
            ['Total revenue', formatMoney(m.revenue.total)],
            ['Rentals', `${m.rentals.total} (${m.rentals.completed} completed)`],
            ['Salik', `${m.salik.trips} trips · ${formatMoney(m.salik.total)} (${m.salik.billed} billed)`],
            ['ENOC fuel', `${m.enoc.transactions} fills · ${formatNumber(m.enoc.liters)} L · ${formatMoney(m.enoc.total)}`],
            ['Fines billed', `${m.fines.billed} · ${formatMoney(m.fines.billedTotal)}`],
            ['Debt added', formatMoney(m.debt.added)],
            ['Debt collected', formatMoney(m.debt.collected)],
            ['Operating cost', formatMoney(m.operatingCost)],
            [
              'Net revenue',
              <Span key="net" weight={600} color="var(--text-primary)">
                {formatMoney(m.netRevenue)}
              </Span>,
            ],
            ['Failed payments', m.failedPayments],
            ['New customers', m.newCustomers],
          ]}
        />
      )}
    </Modal>
  );
};
