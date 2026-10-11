import { useDeleteOverageChargeMutation, useGetOverageChargesQuery } from '@/api/endpoints/tariffsApi';
import { CrudTable } from '@/components/common/crud-table';
import { StatusBadge } from '@/components/common/status-badge';
import { formatMoney } from '@/utils/format';
import { toListState } from '@/utils/queryState';
import { activeStatus } from '@/utils/status';
import { OverageFormModal } from './TariffFormModals';

export const OverageTab = () => {
  const list = toListState(useGetOverageChargesQuery());
  const [deleteOverageCharge] = useDeleteOverageChargeMutation();

  return (
    <CrudTable
      list={list}
      entity="overage charge"
      rowKey={(overage) => overage.id}
      nameOf={(overage) => overage.name}
      columns={[
        { key: 'name', header: 'Name', render: (overage) => overage.name },
        { key: 'price', header: 'Price per km', render: (overage) => formatMoney(overage.pricePerKm, overage.currency) },
        { key: 'threshold', header: 'Free km', render: (overage) => overage.thresholdKm },
        { key: 'status', header: 'Status', render: (overage) => <StatusBadge status={activeStatus(overage.isActive)} /> },
      ]}
      renderForm={(props) => <OverageFormModal {...props} />}
      onDelete={(overage) => deleteOverageCharge(overage.id).unwrap()}
    />
  );
};
