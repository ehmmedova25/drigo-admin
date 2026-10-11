import { useState } from 'react';
import { useDeleteGeoZoneMutation, useGetGasStationsQuery, useGetGeoZonesQuery, useGetParkingZonesQuery } from '@/api/endpoints/geoApi';
import { CrudTable } from '@/components/common/crud-table';
import { DataTable } from '@/components/common/data-table';
import { PageHeader } from '@/components/common/page-header';
import { StatusBadge } from '@/components/common/status-badge';
import { Card } from '@/components/ui/card';
import { Paragraph } from '@/components/ui/paragraph';
import { Swatch } from '@/components/ui/swatch';
import { Tabs } from '@/components/ui/tabs';
import { GEO_TABS, type GeoTab } from '@/constants/geo';
import { formatCoordinates } from '@/utils/format';
import { toListState } from '@/utils/queryState';
import { activeStatus } from '@/utils/status';
import { GeoMap } from './components/GeoMap';
import { GeoZoneFormModal } from './components/GeoZoneFormModal';

const Geo = () => {
  const [tab, setTab] = useState<GeoTab>(GEO_TABS[0]);
  const zones = toListState(useGetGeoZonesQuery());
  const parkingZones = toListState(useGetParkingZonesQuery());
  const gasStations = toListState(useGetGasStationsQuery());
  const [deleteGeoZone] = useDeleteGeoZoneMutation();

  return (
    <>
      <PageHeader title="Geo zones" />
      <Card>
        <GeoMap zones={zones.rows} parkingZones={parkingZones.rows} gasStations={gasStations.rows} />
        <Paragraph color="var(--text-muted)" size="12px" lineHeight="16px">
          Squares: geo zones · green circles: parking · red dots: gas stations
        </Paragraph>
      </Card>
      <Tabs tabs={GEO_TABS} active={tab} onChange={setTab} />
      {tab === 'Geo zones' && (
        <CrudTable
          list={zones}
          entity="geo zone"
          rowKey={(z) => z.id}
          nameOf={(z) => z.name}
          columns={[
            { key: 'color', header: '', render: (z) => <Swatch color={z.color} /> },
            { key: 'name', header: 'Name', render: (z) => z.name },
            { key: 'type', header: 'Type', render: (z) => z.type },
            { key: 'points', header: 'Corners', render: (z) => z.polygon.length },
            { key: 'status', header: 'Status', render: (z) => <StatusBadge status={activeStatus(z.isActive)} /> },
          ]}
          renderForm={(props) => <GeoZoneFormModal {...props} />}
          onDelete={(z) => deleteGeoZone(z.id).unwrap()}
        />
      )}
      {tab === 'Parking zones' && (
        <Card>
          <DataTable
            rows={parkingZones.rows}
            loading={parkingZones.loading}
            error={parkingZones.error}
            onRetry={parkingZones.reload}
            rowKey={(p) => p.id}
            columns={[
              { key: 'name', header: 'Name', render: (p) => p.name },
              { key: 'location', header: 'Location', render: (p) => formatCoordinates(p.latitude, p.longitude) },
              { key: 'radius', header: 'Radius', render: (p) => `${p.radiusMeters} m` },
              { key: 'free', header: 'Parking', render: (p) => (p.isFree ? 'Free' : 'Paid') },
            ]}
          />
        </Card>
      )}
      {tab === 'Gas stations' && (
        <Card>
          <DataTable
            rows={gasStations.rows}
            loading={gasStations.loading}
            error={gasStations.error}
            onRetry={gasStations.reload}
            rowKey={(g) => g.id}
            columns={[
              { key: 'name', header: 'Name', render: (g) => g.name },
              { key: 'brand', header: 'Brand', render: (g) => g.brand },
              { key: 'location', header: 'Location', render: (g) => formatCoordinates(g.latitude, g.longitude) },
            ]}
          />
        </Card>
      )}
    </>
  );
};

export default Geo;
