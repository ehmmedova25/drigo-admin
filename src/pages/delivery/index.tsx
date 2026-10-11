import { useState } from 'react';
import { useDeleteDriverMutation, useDeleteZoneMutation, useGetDriversQuery, useGetZonesQuery } from '@/api/endpoints/deliveryApi';
import { CrudTable } from '@/components/common/crud-table';
import type { Column } from '@/components/common/data-table';
import { PageHeader } from '@/components/common/page-header';
import { StatusBadge } from '@/components/common/status-badge';
import { Select } from '@/components/ui/select';
import { Tabs } from '@/components/ui/tabs';
import { PAGE_SIZE } from '@/constants/config';
import { DELIVERY_TABS, DRIVER_STATUSES, type DeliveryTab } from '@/constants/delivery';
import { COMMON_MESSAGES } from '@/constants/messages';
import { usePagedQuery } from '@/hooks/usePagedQuery';
import type { Driver, Zone } from '@/types/delivery.types';
import { formatCoordinates } from '@/utils/format';
import { activeStatus } from '@/utils/status';
import { DriverFormModal, ZoneFormModal } from './components/DeliveryFormModals';

const DRIVER_COLUMNS: Column<Driver>[] = [
  { key: 'name', header: 'Name', render: (d) => d.fullName },
  { key: 'phone', header: 'Phone', render: (d) => d.phoneNumber },
  { key: 'status', header: 'Status', render: (d) => <StatusBadge status={d.status} /> },
  { key: 'deliveries', header: 'Active / done', render: (d) => `${d.activeDeliveries} / ${d.completedDeliveries}` },
  { key: 'rating', header: 'Rating', render: (d) => d.rating },
];

const ZONE_COLUMNS: Column<Zone>[] = [
  { key: 'name', header: 'Name', render: (z) => z.name },
  { key: 'center', header: 'Center', render: (z) => formatCoordinates(z.centerLat, z.centerLng) },
  { key: 'radius', header: 'Radius', render: (z) => `${z.radiusKm} km` },
  { key: 'drivers', header: 'Drivers', render: (z) => z.driverCount },
  { key: 'status', header: 'Status', render: (z) => <StatusBadge status={activeStatus(z.isActive)} /> },
];

const DriversTab = () => {
  const [status, setStatus] = useState('');
  const list = usePagedQuery(useGetDriversQuery, { status });
  const [deleteDriver] = useDeleteDriverMutation();

  return (
    <CrudTable
      list={list}
      columns={DRIVER_COLUMNS}
      rowKey={(d) => d.id}
      entity="driver"
      nameOf={(d) => d.fullName}
      renderForm={(props) => <DriverFormModal {...props} />}
      onDelete={(d) => deleteDriver(d.id).unwrap()}
      toolbar={<Select value={status} onChange={setStatus} options={DRIVER_STATUSES} placeholder={COMMON_MESSAGES.ALL_STATUSES} />}
    />
  );
};

const ZonesTab = () => {
  const list = usePagedQuery(useGetZonesQuery, {}, PAGE_SIZE.lookup);
  const [deleteZone] = useDeleteZoneMutation();

  return (
    <CrudTable
      list={list}
      columns={ZONE_COLUMNS}
      rowKey={(z) => z.id}
      entity="zone"
      nameOf={(z) => z.name}
      renderForm={(props) => <ZoneFormModal {...props} />}
      onDelete={(z) => deleteZone(z.id).unwrap()}
    />
  );
};

const Delivery = () => {
  const [tab, setTab] = useState<DeliveryTab>(DELIVERY_TABS[0]);

  return (
    <>
      <PageHeader title="Drivers & zones" />
      <Tabs tabs={DELIVERY_TABS} active={tab} onChange={setTab} />
      {tab === 'Drivers' ? <DriversTab /> : <ZonesTab />}
    </>
  );
};

export default Delivery;
