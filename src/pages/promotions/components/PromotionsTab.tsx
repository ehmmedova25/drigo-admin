import { useDeletePromotionMutation, useGetPromotionsQuery, useSetPromotionActiveMutation } from '@/api/endpoints/promotionsApi';
import { CrudTable } from '@/components/common/crud-table';
import { StatusBadge } from '@/components/common/status-badge';
import { useAction } from '@/hooks/useAction';
import { usePagedQuery } from '@/hooks/usePagedQuery';
import { formatDate } from '@/utils/format';
import { activeStatus, toggleActiveLabel } from '@/utils/status';
import { PromotionFormModal } from './PromotionFormModals';
import styles from './PromotionsTab.module.scss';

export const PromotionsTab = () => {
  const list = usePagedQuery(useGetPromotionsQuery);
  const [setPromotionActive] = useSetPromotionActiveMutation();
  const [deletePromotion] = useDeletePromotionMutation();
  const { run } = useAction();

  return (
    <CrudTable
      list={list}
      entity="promotion"
      rowKey={(promotion) => promotion.id}
      nameOf={(promotion) => promotion.title}
      columns={[
        { key: 'image', header: '', render: (promotion) => <img className={styles.thumb} src={promotion.imageUrl} alt="" /> },
        { key: 'title', header: 'Title', render: (promotion) => promotion.title },
        { key: 'action', header: 'On tap', render: (promotion) => promotion.actionType },
        { key: 'frequency', header: 'Show', render: (promotion) => promotion.frequency },
        {
          key: 'period',
          header: 'Period',
          render: (promotion) => `${formatDate(promotion.startDate)} – ${formatDate(promotion.endDate)}`,
        },
        { key: 'status', header: 'Status', render: (promotion) => <StatusBadge status={activeStatus(promotion.isActive)} /> },
      ]}
      rowActions={(promotion) => [
        {
          label: toggleActiveLabel(promotion.isActive),
          onClick: () =>
            run(
              () => setPromotionActive({ id: promotion.id, isActive: !promotion.isActive }).unwrap(),
              promotion.isActive ? 'Promotion deactivated' : 'Promotion activated',
            ),
        },
      ]}
      renderForm={(props) => <PromotionFormModal {...props} />}
      onDelete={(promotion) => deletePromotion(promotion.id).unwrap()}
    />
  );
};
