import { useGetInsurancesQuery, useGetTariffDistancesQuery } from '@/api/endpoints/tariffsApi';
import { DataTable } from '@/components/common/data-table';
import { ErrorState } from '@/components/common/error-state';
import { Loader } from '@/components/common/loader';
import { StatusBadge } from '@/components/common/status-badge';
import { Card } from '@/components/ui/card';
import { Grid } from '@/components/ui/grid';
import { getErrorMessage } from '@/utils/apiError';
import { formatMoney } from '@/utils/format';
import { activeStatus } from '@/utils/status';

export const LookupsTab = () => {
  const distances = useGetTariffDistancesQuery();
  const insurances = useGetInsurancesQuery();
  const error = distances.error ?? insurances.error;

  const retry = () => {
    distances.refetch();
    insurances.refetch();
  };

  if (error) return <ErrorState error={getErrorMessage(error)} onRetry={retry} />;
  if (!distances.data || !insurances.data) return <Loader />;

  return (
    <Grid>
      <Card title="Distance packages">
        <DataTable
          rows={distances.data}
          rowKey={(distance) => distance.id}
          columns={[
            { key: 'km', header: 'Included km', render: (distance) => distance.includedKm },
            { key: 'extra', header: 'Extra km price', render: (distance) => formatMoney(distance.extraKmPrice, distance.currency) },
          ]}
        />
      </Card>
      <Card title="Insurance">
        <DataTable
          rows={insurances.data}
          rowKey={(insurance) => insurance.id}
          columns={[
            { key: 'name', header: 'Name', render: (insurance) => insurance.name },
            { key: 'daily', header: 'Per day', render: (insurance) => formatMoney(insurance.dailyPrice, insurance.currency) },
            { key: 'deductible', header: 'Excess', render: (insurance) => formatMoney(insurance.deductible, insurance.currency) },
            { key: 'status', header: 'Status', render: (insurance) => <StatusBadge status={activeStatus(insurance.isActive)} /> },
          ]}
        />
      </Card>
    </Grid>
  );
};
