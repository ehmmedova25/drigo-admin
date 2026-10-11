import { CircleMarker, Popup } from 'react-leaflet';
import { useGetActiveDeliveriesQuery } from '@/api/endpoints/reservationsApi';
import { ErrorState } from '@/components/common/error-state';
import { MapView } from '@/components/common/map-view';
import { Card } from '@/components/ui/card';
import { Stack } from '@/components/ui/stack';
import { Swatch } from '@/components/ui/swatch';
import { MAP } from '@/constants/config';
import { getErrorMessage } from '@/utils/apiError';
import styles from './DeliveriesMap.module.scss';

export const DeliveriesMap = () => {
  const { data, error, refetch } = useGetActiveDeliveriesQuery();
  if (error) return <ErrorState error={getErrorMessage(error)} onRetry={refetch} />;

  return (
    <Card
      title={`${data?.length ?? 0} active deliveries`}
      action={
        <Stack direction="row" gap="sm" align="center" wrap>
          <span className={styles.legendItem}>
            <Swatch color={MAP.colors.danger} />
            Delivery address
          </span>
          <span className={styles.legendItem}>
            <Swatch color={MAP.colors.primary} />
            Driver
          </span>
        </Stack>
      }
    >
      <MapView>
        {(data ?? []).map((d) => (
          <CircleMarker key={`addr-${d.id}`} center={[d.deliveryLat, d.deliveryLng]} radius={MAP.markerRadius.md} color={MAP.colors.danger}>
            <Popup>
              #{d.id} {d.customerName} · {d.status}
              <br />
              {d.deliveryAddress}
            </Popup>
          </CircleMarker>
        ))}
        {(data ?? []).flatMap((d) =>
          d.driverLat === null || d.driverLng === null
            ? []
            : [
                <CircleMarker key={`drv-${d.id}`} center={[d.driverLat, d.driverLng]} radius={MAP.markerRadius.sm} color={MAP.colors.primary}>
                  <Popup>
                    Driver {d.driverName} · #{d.id}
                  </Popup>
                </CircleMarker>,
              ],
        )}
      </MapView>
    </Card>
  );
};
