import { useDeleteTariffPackageMutation, useGetTariffPackagesQuery } from '@/api/endpoints/tariffsApi';
import { CrudTable } from '@/components/common/crud-table';
import { StatusBadge } from '@/components/common/status-badge';
import type { TariffPackage } from '@/types/tariffs.types';
import { formatDate, formatMoney } from '@/utils/format';
import { toListState } from '@/utils/queryState';
import { activeStatus } from '@/utils/status';
import { PackageFormModal } from './TariffFormModals';

const packageName = (tariffPackage: TariffPackage) =>
  `${tariffPackage.unitCount} ${tariffPackage.timeUnit}${tariffPackage.unitCount > 1 ? 's' : ''}`;

export const PackagesTab = () => {
  const list = toListState(useGetTariffPackagesQuery());
  const [deleteTariffPackage] = useDeleteTariffPackageMutation();

  return (
    <CrudTable
      list={list}
      entity="package"
      rowKey={(tariffPackage) => tariffPackage.id}
      nameOf={packageName}
      columns={[
        { key: 'name', header: 'Package', render: packageName },
        { key: 'price', header: 'Price', render: (tariffPackage) => formatMoney(tariffPackage.price, tariffPackage.currency) },
        {
          key: 'countries',
          header: 'Countries',
          render: (tariffPackage) => tariffPackage.countries.map((country) => country.code).join(', '),
        },
        { key: 'status', header: 'Status', render: (tariffPackage) => <StatusBadge status={activeStatus(tariffPackage.isActive)} /> },
        { key: 'updated', header: 'Updated', render: (tariffPackage) => formatDate(tariffPackage.updatedAt) },
      ]}
      renderForm={(props) => <PackageFormModal {...props} />}
      onDelete={(tariffPackage) => deleteTariffPackage(tariffPackage.id).unwrap()}
    />
  );
};
