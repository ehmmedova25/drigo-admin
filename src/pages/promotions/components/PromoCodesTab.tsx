import { useDeletePromoCodeMutation, useGetPromoCodesQuery, useTogglePromoCodeMutation } from '@/api/endpoints/promotionsApi';
import { CrudTable } from '@/components/common/crud-table';
import { StatusBadge } from '@/components/common/status-badge';
import { Span } from '@/components/ui/span';
import { UNLIMITED } from '@/constants/promotions';
import { useAction } from '@/hooks/useAction';
import { usePagedQuery } from '@/hooks/usePagedQuery';
import { formatDiscountValue } from '@/utils/discountValue';
import { formatDate } from '@/utils/format';
import { activeStatus, toggleActiveLabel } from '@/utils/status';
import { PromoCodeFormModal } from './PromotionFormModals';

export const PromoCodesTab = () => {
  const list = usePagedQuery(useGetPromoCodesQuery);
  const [togglePromoCode] = useTogglePromoCodeMutation();
  const [deletePromoCode] = useDeletePromoCodeMutation();
  const { run } = useAction();

  return (
    <CrudTable
      list={list}
      entity="promo code"
      rowKey={(promoCode) => promoCode.id}
      nameOf={(promoCode) => promoCode.code}
      columns={[
        {
          key: 'code',
          header: 'Code',
          render: (promoCode) => (
            <Span weight="500" color="var(--text-primary)">
              {promoCode.code}
            </Span>
          ),
        },
        { key: 'value', header: 'Value', render: (promoCode) => formatDiscountValue(promoCode.discountType, promoCode.value) },
        {
          key: 'redemptions',
          header: 'Redeemed',
          render: (promoCode) => `${promoCode.redemptionCount} / ${promoCode.maxRedemptions ?? UNLIMITED}`,
        },
        { key: 'expires', header: 'Expires', render: (promoCode) => formatDate(promoCode.expiresAt) },
        { key: 'status', header: 'Status', render: (promoCode) => <StatusBadge status={activeStatus(promoCode.isActive)} /> },
      ]}
      rowActions={(promoCode) => [
        {
          label: toggleActiveLabel(promoCode.isActive),
          onClick: () =>
            run(() => togglePromoCode(promoCode.id).unwrap(), promoCode.isActive ? 'Code deactivated' : 'Code activated'),
        },
      ]}
      renderForm={(props) => <PromoCodeFormModal {...props} />}
      onDelete={(promoCode) => deletePromoCode(promoCode.id).unwrap()}
    />
  );
};
