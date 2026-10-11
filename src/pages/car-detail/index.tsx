import { useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { CircleMarker, Polyline, Popup } from 'react-leaflet';
import {
  useDeleteCarMutation,
  useGetCarCommandsQuery,
  useGetCarGpsPointsQuery,
  useGetCarLastActivityQuery,
  useGetCarQuery,
  useGetCarStatusQuery,
  useSendCarCommandMutation,
  useToggleCarActiveMutation,
} from '@/api/endpoints/carsApi';
import { ActionModal } from '@/components/common/action-modal';
import { CarFormModal } from '@/components/common/car-form-modal';
import { ErrorState } from '@/components/common/error-state';
import { FieldList } from '@/components/common/field-list';
import { Loader } from '@/components/common/loader';
import { MapView } from '@/components/common/map-view';
import { PageHeader } from '@/components/common/page-header';
import { StatusBadge } from '@/components/common/status-badge';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Grid } from '@/components/ui/grid';
import { Heading } from '@/components/ui/heading';
import { Link } from '@/components/ui/link';
import { Paragraph } from '@/components/ui/paragraph';
import { Stack } from '@/components/ui/stack';
import { TRANSMISSIONS } from '@/constants/cars';
import { MAP } from '@/constants/config';
import { ROUTES } from '@/constants/paths';
import { useAction } from '@/hooks/useAction';
import { getErrorMessage } from '@/utils/apiError';
import { carState } from '@/utils/carState';
import { formatDateTime, formatMoney, formatNumber } from '@/utils/format';
import { toggleActiveLabel } from '@/utils/status';
import { CarHero } from './components/CarHero';

const joinNames = (items: { name: string }[] | null) => items?.map((i) => i.name).join(', ') || null;

const CarDetail = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const carQuery = useGetCarQuery(id);
  const statusQuery = useGetCarStatusQuery(id);
  const lastActivityQuery = useGetCarLastActivityQuery(id);
  const gpsQuery = useGetCarGpsPointsQuery(id);
  const commandsQuery = useGetCarCommandsQuery();
  const [toggleActive] = useToggleCarActiveMutation();
  const [sendCommand] = useSendCarCommandMutation();
  const [deleteCar] = useDeleteCarMutation();
  const { run, busy } = useAction();
  const [modal, setModal] = useState<'edit' | 'delete' | null>(null);

  const queries = [carQuery, statusQuery, lastActivityQuery, gpsQuery, commandsQuery];
  const reload = () => queries.forEach((query) => query.refetch());

  const removeCar = async (carId: number) => {
    const result = await deleteCar(carId).unwrap();
    navigate(ROUTES.CARS);
    return result;
  };

  if (queries.some((query) => query.isLoading)) return <Loader />;
  const { data: car } = carQuery;
  const { data: status } = statusQuery;
  const { data: lastActivity } = lastActivityQuery;
  const { data: gps } = gpsQuery;
  const { data: commands } = commandsQuery;
  const error = queries.find((query) => query.error)?.error;
  if (error || !car || !status || !lastActivity || !gps || !commands) {
    return <ErrorState error={getErrorMessage(error)} onRetry={reload} />;
  }

  return (
    <>
      <PageHeader
        back={{ to: ROUTES.CARS, label: 'Cars' }}
        title={`${car.brandName} ${car.modelName}`}
        badge={<StatusBadge status={carState(car.isActive, Boolean(status.activeRentalId))} />}
        actions={
          <>
            <Button onClick={() => setModal('edit')}>Edit</Button>
            <Button
              disabled={busy}
              onClick={() => run(() => toggleActive(car.id).unwrap(), car.isActive ? 'Car deactivated' : 'Car activated')}
            >
              {toggleActiveLabel(car.isActive)}
            </Button>
            <Button variant="danger" onClick={() => setModal('delete')}>
              Delete
            </Button>
            <Button onClick={reload}>Refresh</Button>
          </>
        }
      />

      {status.activeRentalId && (
        <Alert variant="info">
          Currently rented:{' '}
          <Link component={RouterLink} to={ROUTES.RENTAL(status.activeRentalId)}>
            rental #{status.activeRentalId}
          </Link>
        </Alert>
      )}

      <CarHero car={car} />

      <Grid>
        <Card title="Details">
          <FieldList
            items={[
              ['Plate', car.plateNumber],
              ['Year', car.manufactureYear],
              ['Body / seats', `${car.bodyType} / ${car.seats}`],
              ['Color', car.colorName],
              ['Fuel', `${car.fuelTypeName} · ${car.fuelLevel}%`],
              ['Engine', `${car.engineCapacity} ${car.engineUnit}`],
              ['Transmission', TRANSMISSIONS.find((t) => t.value === car.transmission)?.label],
              ['Max speed', `${car.maxSpeed} km/h`],
              ['Odometer', `${formatNumber(car.distance)} km`],
              ['VIN', car.chassisNumber],
              ['IMEI', car.imei],
              ['Price (tariff)', formatMoney(car.price)],
              ['Free insurance', car.freeInsurance ? 'Yes' : 'No'],
              ['End trip in', joinNames(car.endTripAvailableCities)],
              ['Features', joinNames(car.carFeatures)],
              ['Added', formatDateTime(car.createdAt)],
            ]}
          />
        </Card>
        <Card title="Live status" gap="md">
          <FieldList
            items={[
              ['Online', <StatusBadge key="online" status={status.online ? 'Online' : 'Offline'} />],
              ['Engine', status.engineOn ? 'On' : 'Off'],
              ['Speed', `${status.speed} km/h`],
              ['Doors', status.doorsLocked ? 'Locked' : 'Unlocked'],
              ['Last activity', `${lastActivity.event} · ${formatDateTime(lastActivity.lastActivityAt)}`],
              ['Address', car.location?.address],
            ]}
          />
          <Stack gap="sm">
            <Heading as="h3" size="15px" lineHeight="22px" weight="500">
              Send command
            </Heading>
            <Stack direction="row" gap="xs" align="center" wrap>
              {commands.map((cmd) => (
                <Button
                  key={cmd.code}
                  size="sm"
                  disabled={busy}
                  onClick={() => run(() => sendCommand({ id: car.id, command: cmd.code }).unwrap(), `${cmd.name}: sent`)}
                >
                  {cmd.name}
                </Button>
              ))}
            </Stack>
          </Stack>
        </Card>
      </Grid>

      {car.location && (
        <Card title="Location & recent GPS track">
          <MapView center={[car.location.latitude, car.location.longitude]} zoom={MAP.detailZoom}>
            <Polyline positions={gps.map((p): [number, number] => [p.latitude, p.longitude])} color={MAP.colors.primary} />
            <CircleMarker center={[car.location.latitude, car.location.longitude]} radius={MAP.markerRadius.xl} color={MAP.colors.danger}>
              <Popup>{car.plateNumber}</Popup>
            </CircleMarker>
          </MapView>
        </Card>
      )}

      {modal === 'edit' && <CarFormModal car={car} onClose={() => setModal(null)} />}
      {modal === 'delete' && (
        <ActionModal
          title="Delete car"
          submitText="Delete"
          successMessage="Car deleted"
          danger
          onSubmit={() => removeCar(car.id)}
          onClose={() => setModal(null)}
        >
          <Paragraph>Delete this car permanently? A car with an active rental cannot be deleted.</Paragraph>
        </ActionModal>
      )}
    </>
  );
};

export default CarDetail;
