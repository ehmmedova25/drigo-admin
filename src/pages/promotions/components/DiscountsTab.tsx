import { useState } from 'react';
import { useDeleteDiscountMutation, useGetDiscountsQuery, useSetDiscountStatusMutation } from '@/api/endpoints/promotionsApi';
import { CrudTable } from '@/components/common/crud-table';
import { StatusBadge } from '@/components/common/status-badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Span } from '@/components/ui/span';
import { COMMON_MESSAGES } from '@/constants/messages';
import { DISCOUNT_STATUSES, UNLIMITED } from '@/constants/promotions';
import { useAction } from '@/hooks/useAction';
import { useDebounce } from '@/hooks/useDebounce';
import { usePagedQuery } from '@/hooks/usePagedQuery';
import type { Discount } from '@/types/promotions.types';
import { formatDiscountValue } from '@/utils/discountValue';
import { formatDate } from '@/utils/format';
import { DiscountDetailsModal } from './DetailModals';
import { DiscountFormModal } from './PromotionFormModals';

const nextStatus = (discount: Discount) => (discount.status === 'Active' ? 'Paused' : 'Active');

export const DiscountsTab = () => {
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const list = usePagedQuery(useGetDiscountsQuery, { status, search: useDebounce(search) });
  const [setDiscountStatus] = useSetDiscountStatusMutation();
  const [deleteDiscount] = useDeleteDiscountMutation();
  const { run } = useAction();
  const [opened, setOpened] = useState<Discount | null>(null);

  return (
    <>
      <CrudTable
        list={list}
        entity="discount"
        rowKey={(discount) => discount.id}
        nameOf={(discount) => discount.name}
        onRowClick={setOpened}
        toolbar={
          <>
            <Input placeholder="Search by name" value={search} onChange={(event) => setSearch(event.target.value)} />
            <Select value={status} onChange={setStatus} options={DISCOUNT_STATUSES} placeholder={COMMON_MESSAGES.ALL_STATUSES} />
          </>
        }
        columns={[
          {
            key: 'name',
            header: 'Name',
            render: (discount) => (
              <Span weight="500" color="var(--text-primary)">
                {discount.name}
              </Span>
            ),
          },
          { key: 'value', header: 'Value', render: (discount) => formatDiscountValue(discount.type, discount.value) },
          { key: 'audience', header: 'Audience', render: (discount) => discount.targetAudience },
          { key: 'scope', header: 'Applies to', render: (discount) => discount.scope },
          { key: 'usage', header: 'Used', render: (discount) => `${discount.usedCount} / ${discount.usageLimit ?? UNLIMITED}` },
          { key: 'ends', header: 'Ends', render: (discount) => formatDate(discount.endDate) },
          { key: 'status', header: 'Status', render: (discount) => <StatusBadge status={discount.status} /> },
        ]}
        rowActions={(discount) => [
          {
            label: nextStatus(discount) === 'Paused' ? 'Pause' : 'Activate',
            onClick: () =>
              run(
                () => setDiscountStatus({ id: discount.id, status: nextStatus(discount) }).unwrap(),
                `Discount ${nextStatus(discount).toLowerCase()}`,
              ),
          },
        ]}
        renderForm={(props) => <DiscountFormModal {...props} />}
        onDelete={(discount) => deleteDiscount(discount.id).unwrap()}
      />
      {opened && <DiscountDetailsModal discount={opened} onClose={() => setOpened(null)} />}
    </>
  );
};
