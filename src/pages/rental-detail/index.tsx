import { useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { CircleMarker, Polyline } from 'react-leaflet';
import { useGetRentalPaymentsQuery, useGetRentalQuery, useGetRentalRouteQuery } from '@/api/endpoints/rentalsApi';
import { DataTable } from '@/components/common/data-table';
import { ErrorState } from '@/components/common/error-state';
import { FieldList } from '@/components/common/field-list';
import { Loader } from '@/components/common/loader';
import { MapView } from '@/components/common/map-view';
import { PageHeader } from '@/components/common/page-header';
import { PaymentsTable } from '@/components/common/payments-table';
import { StatusBadge } from '@/components/common/status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Grid } from '@/components/ui/grid';
import { Link } from '@/components/ui/link';
import { Stack } from '@/components/ui/stack';
import { MAP } from '@/constants/config';
import { ROUTES } from '@/constants/paths';
import { ENDABLE_STATUSES } from '@/constants/rentals';
import { getErrorMessage } from '@/utils/apiError';
import { formatDateTime, formatMoney, formatNumber, orDash } from '@/utils/format';
import { PhotoRow } from './components/PhotoRow';
import { ChangeStatusModal, CompensationKmModal, EndRentalModal, KmPackageModal, SwitchCarModal } from './components/RentalActionModals';
import { RentalAlerts } from './components/RentalAlerts';

type ModalKind = 'end' | 'switch' | 'status' | 'comp' | 'km';

const RentalDetail = () => {
  const { id = '' } = useParams();
  const rentalQuery = useGetRentalQuery(id);
  const paymentsQuery = useGetRentalPaymentsQuery(id);
  const routeQuery = useGetRentalRouteQuery(id);
  const [modal, setModal] = useState<ModalKind | null>(null);

  const loading = rentalQuery.isFetching || paymentsQuery.isFetching || routeQuery.isFetching;
  const error = rentalQuery.error ?? paymentsQuery.error ?? routeQuery.error;
  const reload = () => {
    rentalQuery.refetch();
    paymentsQuery.refetch();
    routeQuery.refetch();
  };

  if (rentalQuery.isLoading || paymentsQuery.isLoading || routeQuery.isLoading) return <Loader />;
  if (error || !rentalQuery.data || !paymentsQuery.data || !routeQuery.data) {
    return <ErrorState error={getErrorMessage(error)} onRetry={reload} />;
  }
  const rental = rentalQuery.data;
  const payments = paymentsQuery.data;
  const route = routeQuery.data.coordinates.map((point): [number, number] => [point.latitude, point.longitude]);
  const modalProps = { rentalId: rental.id, onClose: () => setModal(null) };

  return (
    <>
      <PageHeader
        back={{ to: ROUTES.RENTALS, label: 'Rentals' }}
        title={`Rental #${rental.id}`}
        badge={<StatusBadge status={rental.status} />}
        actions={
          <>
            <Button variant="danger" disabled={!ENDABLE_STATUSES.includes(rental.status)} onClick={() => setModal('end')}>
              End rental
            </Button>
            <Button onClick={() => setModal('switch')}>Switch car</Button>
            <Button onClick={() => setModal('status')}>Change status</Button>
            <Button onClick={() => setModal('comp')}>Comp km</Button>
            <Button onClick={() => setModal('km')}>Add km package</Button>
            <Button onClick={reload} disabled={loading}>
              Refresh
            </Button>
          </>
        }
      />

      <RentalAlerts rental={rental} />

      <Grid>
        <Card title="Rental">
          <FieldList
            items={[
              ['Start', formatDateTime(rental.startDate)],
              ['End', formatDateTime(rental.endDate)],
              [
                'Tariff',
                rental.tariff
                  ? `${rental.tariff.packageName} · ${formatMoney(rental.tariff.activePrice)} · ${formatNumber(rental.tariff.includedDistance)} km included`
                  : null,
              ],
              ['Insurance', rental.insurance ? `${rental.insurance.name} (${formatMoney(rental.insurance.dailyPrice)}/day)` : null],
              ['Total price', formatMoney(rental.totalPrice)],
              ['Distance', `${formatNumber(rental.totalDistance)} km`],
              [
                'Purchased / comp km',
                `${formatNumber(rental.purchasedDistanceTotal ?? 0)} / ${formatNumber(rental.compensationDistanceTotal ?? 0)} km`,
              ],
              ['Discount', rental.discountName ? `${rental.discountName} (${formatMoney(rental.discountAmount)})` : null],
              [
                'Next payment',
                rental.nextPaymentDue ? `${formatDateTime(rental.nextPaymentDue)} · ${formatMoney(rental.nextPaymentTotal)}` : null,
              ],
              ['Grace period until', formatDateTime(rental.paymentGracePeriodUntil)],
              ['Accident', rental.hasAccident ? 'Yes' : 'No'],
              ['Unpaid debt (this rental)', formatMoney(rental.totalDebt)],
            ]}
          />
        </Card>
        <Stack gap="md">
          <Card title="Customer">
            <FieldList
              items={[
                [
                  'Name',
                  rental.user?.id && (
                    <Link key="customer" component={RouterLink} to={ROUTES.CUSTOMER(rental.user.id)}>
                      {rental.user.fullName}
                    </Link>
                  ),
                ],
                ['Phone', rental.user?.phoneNumber],
                ['Email', rental.user?.email || null],
              ]}
            />
          </Card>
          <Card title="Car">
            <FieldList
              items={[
                [
                  'Car',
                  rental.car?.id && (
                    <Link key="car" component={RouterLink} to={ROUTES.CAR(rental.car.id)}>
                      {rental.car.brand} {rental.car.model} ({orDash(rental.car.year)})
                    </Link>
                  ),
                ],
                ['Plate', rental.car?.plateNumber],
                ['Color / fuel', `${orDash(rental.car?.color)} / ${orDash(rental.car?.fuelType)}`],
              ]}
            />
          </Card>
        </Stack>
      </Grid>

      <Card title="Payments">
        <PaymentsTable userId={rental.user.id} payments={payments} />
      </Card>

      <Grid>
        <Card title="Debts from this rental">
          <DataTable
            rows={rental.debts ?? []}
            rowKey={(debt) => debt.id}
            emptyText="No debts"
            columns={[
              { key: 'type', header: 'Type', render: (debt) => debt.type },
              { key: 'desc', header: 'Description', render: (debt) => debt.description },
              { key: 'amount', header: 'Amount', render: (debt) => formatMoney(debt.amount) },
              { key: 'paid', header: 'Status', render: (debt) => <StatusBadge status={debt.isPaid ? 'Paid' : 'Unpaid'} /> },
            ]}
          />
        </Card>
        <Card title="Action history">
          <DataTable
            rows={rental.actionHistory ?? []}
            rowKey={(action) => action.id}
            emptyText="No actions"
            columns={[
              { key: 'action', header: 'Action', render: (action) => action.action },
              { key: 'by', header: 'By', render: (action) => action.by },
              { key: 'at', header: 'At', render: (action) => formatDateTime(action.at) },
              { key: 'note', header: 'Note', render: (action) => action.note ?? '' },
            ]}
          />
        </Card>
      </Grid>

      {route.length > 0 && (
        <Card title="Route">
          <MapView center={route[0]} zoom={MAP.detailZoom}>
            <Polyline positions={route} color={MAP.colors.primary} />
            <CircleMarker center={route[0]} radius={MAP.markerRadius.md} color={MAP.colors.success} />
            <CircleMarker center={route[route.length - 1]} radius={MAP.markerRadius.md} color={MAP.colors.danger} />
          </MapView>
        </Card>
      )}

      <Card title="Photos">
        <PhotoRow title="Start" urls={rental.startPhotoUrls} />
        <PhotoRow title="End" urls={rental.endPhotoUrls} />
      </Card>

      <Card title="Customer's other rentals">
        <DataTable
          rows={rental.userRentalHistory ?? []}
          rowKey={(history) => history.id}
          emptyText="No other rentals"
          columns={[
            {
              key: 'id',
              header: '#',
              render: (history) => (
                <Link component={RouterLink} to={ROUTES.RENTAL(history.id)}>
                  {history.id}
                </Link>
              ),
            },
            { key: 'status', header: 'Status', render: (history) => <StatusBadge status={history.status} /> },
            { key: 'start', header: 'Start', render: (history) => formatDateTime(history.startDate) },
            { key: 'price', header: 'Price', render: (history) => formatMoney(history.totalPrice) },
          ]}
        />
      </Card>

      {modal === 'end' && <EndRentalModal {...modalProps} />}
      {modal === 'switch' && <SwitchCarModal {...modalProps} />}
      {modal === 'status' && <ChangeStatusModal {...modalProps} current={rental.status} />}
      {modal === 'comp' && <CompensationKmModal {...modalProps} />}
      {modal === 'km' && <KmPackageModal {...modalProps} />}
    </>
  );
};

export default RentalDetail;
