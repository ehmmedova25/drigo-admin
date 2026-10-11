import { useState } from 'react';
import {
  useDeleteSubscriptionPlanMutation,
  useGetSubscriptionPlanModelsQuery,
  useGetSubscriptionPlansQuery,
} from '@/api/endpoints/subscriptionsApi';
import { CrudTable } from '@/components/common/crud-table';
import { StatusBadge } from '@/components/common/status-badge';
import { EMPTY_VALUE } from '@/constants/config';
import type { ModelWithPlan } from '@/types/subscriptions.types';
import { formatMoney, orDash } from '@/utils/format';
import { toListState } from '@/utils/queryState';
import { activeStatus } from '@/utils/status';
import { PlanModal } from './SubscriptionModals';

export const PlansTab = () => {
  const models = useGetSubscriptionPlanModelsQuery();
  const plans = useGetSubscriptionPlansQuery();
  const [deleteSubscriptionPlan] = useDeleteSubscriptionPlanMutation();
  const [editing, setEditing] = useState<ModelWithPlan | null>(null);

  const planByModel = new Map(plans.data?.map((plan) => [plan.modelId, plan]));
  const rows: ModelWithPlan[] | undefined =
    plans.data && models.data?.map((model) => ({ ...model, plan: planByModel.get(model.modelId) ?? null }));

  const list = toListState({
    data: rows,
    isFetching: models.isFetching || plans.isFetching,
    error: models.error ?? plans.error,
    refetch: () => {
      models.refetch();
      plans.refetch();
    },
  });

  return (
    <>
      <CrudTable
        list={list}
        entity="plan"
        rowKey={(model) => model.modelId}
        nameOf={(model) => `${model.modelName} plan`}
        columns={[
          { key: 'model', header: 'Model', render: (model) => model.modelName },
          {
            key: 'price',
            header: 'Monthly price',
            render: (model) => (model.plan ? formatMoney(model.plan.monthlyPrice, model.plan.currency) : EMPTY_VALUE),
          },
          { key: 'km', header: 'Km / month', render: (model) => orDash(model.plan?.includedKm) },
          { key: 'min', header: 'Min months', render: (model) => orDash(model.plan?.minMonths) },
          { key: 'status', header: 'Plan', render: (model) => <StatusBadge status={activeStatus(model.hasPlan)} /> },
        ]}
        rowActions={(model) => [{ label: model.hasPlan ? 'Edit plan' : 'Create plan', onClick: () => setEditing(model) }]}
        onDelete={(model) => deleteSubscriptionPlan(model.modelId).unwrap()}
        canDelete={(model) => model.hasPlan}
      />
      {editing && <PlanModal item={editing} onClose={() => setEditing(null)} />}
    </>
  );
};
