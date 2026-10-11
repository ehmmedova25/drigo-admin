import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useGetCarServicesQuery, useSetCarServiceStatusMutation } from '@/api/endpoints/operationsApi';
import { CrudTable } from '@/components/common/crud-table';
import { StatusBadge } from '@/components/common/status-badge';
import { StatusChangeModal } from '@/components/common/status-change-modal';
import { Link } from '@/components/ui/link';
import { SERVICE_STATUSES } from '@/constants/operations';
import { ROUTES } from '@/constants/paths';
import { usePagedQuery } from '@/hooks/usePagedQuery';
import type { CarService } from '@/types/operations.types';
import { formatDateTime, formatMoney, formatNumber } from '@/utils/format';

export const ServicesTab = () => {
  const list = usePagedQuery(useGetCarServicesQuery);
  const [setCarServiceStatus] = useSetCarServiceStatusMutation();
  const [editing, setEditing] = useState<CarService | null>(null);

  return (
    <>
      <CrudTable
        list={list}
        entity="service"
        rowKey={(service) => service.id}
        nameOf={(service) => service.type}
        columns={[
          { key: 'when', header: 'Scheduled', render: (service) => formatDateTime(service.scheduledAt) },
          {
            key: 'car',
            header: 'Car',
            render: (service) => (
              <Link component={RouterLink} to={ROUTES.CAR(service.carId)}>
                {service.plateNumber}
              </Link>
            ),
          },
          { key: 'type', header: 'Service', render: (service) => service.type },
          { key: 'odometer', header: 'Odometer', render: (service) => `${formatNumber(service.odometer)} km` },
          { key: 'cost', header: 'Cost', render: (service) => formatMoney(service.cost, service.currency) },
          { key: 'done', header: 'Completed', render: (service) => formatDateTime(service.completedAt) },
          { key: 'status', header: 'Status', render: (service) => <StatusBadge status={service.status} /> },
        ]}
        rowActions={(service) => [{ label: 'Status', onClick: () => setEditing(service) }]}
      />
      {editing && (
        <StatusChangeModal
          title={`${editing.type} · ${editing.plateNumber}`}
          current={editing.status}
          options={SERVICE_STATUSES}
          onSubmit={(status) => setCarServiceStatus({ id: editing.id, status }).unwrap()}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  );
};
