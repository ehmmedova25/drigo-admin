import { useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { CircleMarker, Popup } from 'react-leaflet';
import { useGetReservationQuery } from '@/api/endpoints/reservationsApi';
import { EmptyState } from '@/components/common/empty-state';
import { ErrorState } from '@/components/common/error-state';
import { FieldList } from '@/components/common/field-list';
import { Loader } from '@/components/common/loader';
import { MapView } from '@/components/common/map-view';
import { PageHeader } from '@/components/common/page-header';
import { StatusBadge } from '@/components/common/status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Grid } from '@/components/ui/grid';
import { Link } from '@/components/ui/link';
import { MAP } from '@/constants/config';
import { ROUTES } from '@/constants/paths';
import { FINISHED_STATUSES } from '@/constants/reservations';
import { getErrorMessage } from '@/utils/apiError';
import { formatDateTime, formatMoney } from '@/utils/format';
import { PipelineSteps } from './components/PipelineSteps';
import { AssignDriverModal, CancelReservationModal } from './components/ReservationActionModals';

const ReservationDetail = () => {
  const { id = '' } = useParams();
  const { data: reservation, isLoading, error, refetch } = useGetReservationQuery(id);
  const [modal, setModal] = useState<'assign' | 'cancel' | null>(null);

  if (isLoading) return <Loader />;
  if (error || !reservation) return <ErrorState error={getErrorMessage(error)} onRetry={refetch} />;

  const finished = FINISHED_STATUSES.includes(reservation.status);
  const { latitude, longitude } = reservation.deliveryAddress ?? {};
  const modalProps = { reservationId: reservation.id, onClose: () => setModal(null) };

  return (
    <>
      <PageHeader
        back={{ to: ROUTES.RESERVATIONS, label: 'Reservations' }}
        title={`Reservation #${reservation.id}`}
        badge={<StatusBadge status={reservation.status} />}
        actions={
          <>
            <Button variant="primary" disabled={finished} onClick={() => setModal('assign')}>
              {reservation.driver ? 'Change driver' : 'Assign driver'}
            </Button>
            <Button variant="danger" disabled={finished} onClick={() => setModal('cancel')}>
              Cancel
            </Button>
            <Button onClick={refetch}>Refresh</Button>
          </>
        }
      />
      <PipelineSteps status={reservation.status} />

      <Grid>
        <Card title="Details">
          <FieldList
            items={[
              [
                'Customer',
                reservation.user ? (
                  <Link key="customer" component={RouterLink} to={ROUTES.CUSTOMER(reservation.user.id)}>
                    {reservation.user.fullName}
                  </Link>
                ) : (
                  reservation.customerName
                ),
              ],
              ['Phone', reservation.customerPhone],
              [
                'Car',
                reservation.car ? (
                  <Link key="car" component={RouterLink} to={ROUTES.CAR(reservation.car.id)}>
                    {reservation.carName}
                  </Link>
                ) : (
                  reservation.carName
                ),
              ],
              ['Plate', reservation.plateNumber],
              ['Reserved at', formatDateTime(reservation.reservationDate)],
              ['Delivery', reservation.isImmediate ? 'Immediate' : formatDateTime(reservation.scheduledDeliveryDate)],
              ['Address', reservation.deliveryAddress?.address],
              ['Price', formatMoney(reservation.totalPrice)],
              ['Driver', reservation.driver && `${reservation.driver.fullName} (${reservation.driver.phoneNumber})`],
            ]}
          />
        </Card>
        <Card title="Map">
          {latitude != null && longitude != null ? (
            <MapView center={[latitude, longitude]}>
              <CircleMarker center={[latitude, longitude]} radius={MAP.markerRadius.lg} color={MAP.colors.danger}>
                <Popup>Delivery address</Popup>
              </CircleMarker>
              {reservation.driver && (
                <CircleMarker
                  center={[reservation.driver.currentLat, reservation.driver.currentLng]}
                  radius={MAP.markerRadius.md}
                  color={MAP.colors.primary}
                >
                  <Popup>Driver {reservation.driver.fullName}</Popup>
                </CircleMarker>
              )}
            </MapView>
          ) : (
            <EmptyState text="No coordinates" />
          )}
        </Card>
      </Grid>

      {modal === 'assign' && <AssignDriverModal {...modalProps} />}
      {modal === 'cancel' && <CancelReservationModal {...modalProps} />}
    </>
  );
};

export default ReservationDetail;
