import { useDeleteTariffPlanMutation, useGetTariffPlansQuery } from '@/api/endpoints/tariffsApi';
import { CrudTable } from '@/components/common/crud-table';
import { StatusBadge } from '@/components/common/status-badge';
import { formatDate } from '@/utils/format';
import { toListState } from '@/utils/queryState';
import { activeStatus } from '@/utils/status';
import { PlanFormModal } from './TariffFormModals';

export const PlansTab = () => {
  const list = toListState(useGetTariffPlansQuery());
  const [deleteTariffPlan] = useDeleteTariffPlanMutation();

  return (
    <CrudTable
      list={list}
      entity="plan"
      rowKey={(plan) => plan.id}
      nameOf={(plan) => plan.name}
      columns={[
        { key: 'name', header: 'Name', render: (plan) => plan.name },
        { key: 'description', header: 'Description', render: (plan) => plan.description },
        { key: 'status', header: 'Status', render: (plan) => <StatusBadge status={activeStatus(plan.isActive)} /> },
        { key: 'created', header: 'Created', render: (plan) => formatDate(plan.createdAt) },
      ]}
      renderForm={(props) => <PlanFormModal {...props} />}
      onDelete={(plan) => deleteTariffPlan(plan.id).unwrap()}
    />
  );
};
