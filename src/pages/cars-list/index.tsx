import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetCarsQuery, useGetProblematicCarsQuery } from '@/api/endpoints/carsApi';
import { CarFormModal } from '@/components/common/car-form-modal';
import { DataTable, type Column } from '@/components/common/data-table';
import { PageHeader } from '@/components/common/page-header';
import { StatusBadge } from '@/components/common/status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Stack } from '@/components/ui/stack';
import { Swatch } from '@/components/ui/swatch';
import { Tabs } from '@/components/ui/tabs';
import { CAR_SORT_OPTIONS, CAR_TABS, type CarTab } from '@/constants/cars';
import { ROUTES } from '@/constants/paths';
import { useDebounce } from '@/hooks/useDebounce';
import { usePagedQuery } from '@/hooks/usePagedQuery';
import type { CarListItem, ProblematicCar } from '@/types/cars.types';
import { carState } from '@/utils/carState';
import { orDash } from '@/utils/format';
import { toListState } from '@/utils/queryState';
import { SORT_ORDER_OPTIONS } from '@/utils/sorting';
import { CarGrid } from './components/CarGrid';
import styles from './style.module.scss';

const columns: Column<CarListItem>[] = [
  { key: 'id', header: '#', render: (c) => c.id },
  { key: 'car', header: 'Car', render: (c) => `${c.brandName} ${c.modelName}` },
  { key: 'year', header: 'Year', render: (c) => c.manufactureYear },
  { key: 'plate', header: 'Plate', render: (c) => orDash(c.plateNumber) },
  {
    key: 'color',
    header: 'Color',
    render: (c) => (
      <Stack direction="row" gap="xs" align="center">
        <Swatch color={c.colorHexCode ?? undefined} />
        {c.colorName}
      </Stack>
    ),
  },
  { key: 'fuel', header: 'Fuel', render: (c) => `${c.fuelLevel}%` },
  { key: 'state', header: 'Status', render: (c) => <StatusBadge status={carState(c.isActive, Boolean(c.activeRentalId))} /> },
];

const problemColumns: Column<ProblematicCar>[] = [...columns, { key: 'issues', header: 'Issues', render: (c) => c.issues.join(', ') }];

interface ProblematicCarsProps {
  onOpen: (id: number) => void;
}

const ProblematicCars = ({ onOpen }: ProblematicCarsProps) => {
  const { rows, loading, error, reload } = toListState(useGetProblematicCarsQuery());
  return (
    <Card>
      <DataTable
        rows={rows}
        loading={loading}
        error={error}
        onRetry={reload}
        columns={problemColumns}
        rowKey={(c) => c.id}
        onRowClick={(c) => onOpen(c.id)}
        emptyText="No problematic cars"
      />
    </Card>
  );
};

const CarsList = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<CarTab>(CAR_TABS[0]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState(CAR_SORT_OPTIONS[0].value);
  const [sortOrder, setSortOrder] = useState(SORT_ORDER_OPTIONS[0].value);
  const [creating, setCreating] = useState(false);

  const list = usePagedQuery(useGetCarsQuery, { search: useDebounce(search), sortBy, sortOrder });

  return (
    <>
      <PageHeader
        title="Cars"
        actions={
          <Button variant="primary" onClick={() => setCreating(true)}>
            New car
          </Button>
        }
      />
      <Tabs tabs={CAR_TABS} active={tab} onChange={setTab} />
      {tab === 'All cars' ? (
        <>
          <Stack direction="row" gap="xs" align="center" wrap>
            <Input
              className={styles.search}
              placeholder="Search brand, model, plate, IMEI"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Select value={sortBy} onChange={setSortBy} options={CAR_SORT_OPTIONS} />
            <Select value={sortOrder} onChange={setSortOrder} options={SORT_ORDER_OPTIONS} />
          </Stack>
          <CarGrid list={list} onOpen={(id) => navigate(ROUTES.CAR(id))} />
        </>
      ) : (
        <ProblematicCars onOpen={(id) => navigate(ROUTES.CAR(id))} />
      )}
      {creating && <CarFormModal onClose={() => setCreating(false)} onSaved={(id) => navigate(ROUTES.CAR(id))} />}
    </>
  );
};

export default CarsList;
