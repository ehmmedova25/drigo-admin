import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { CircleMarker, Popup } from 'react-leaflet';
import { useGetCarTrackingQuery } from '@/api/endpoints/carsApi';
import { ErrorState } from '@/components/common/error-state';
import { MapView } from '@/components/common/map-view';
import { PageHeader } from '@/components/common/page-header';
import { Card } from '@/components/ui/card';
import { Link } from '@/components/ui/link';
import { Select } from '@/components/ui/select';
import { Span } from '@/components/ui/span';
import { Stack } from '@/components/ui/stack';
import { Swatch } from '@/components/ui/swatch';
import { CAR_STATE_COLORS, TRACKING_FILTERS } from '@/constants/cars';
import { MAP, MS_PER_SECOND, TIMING } from '@/constants/config';
import { ROUTES } from '@/constants/paths';
import { getErrorMessage } from '@/utils/apiError';

const MARKER_FILL_OPACITY = 0.8;

const Tracking = () => {
  const { data, error, refetch } = useGetCarTrackingQuery(undefined, { pollingInterval: TIMING.trackingPollMs });
  const [filter, setFilter] = useState('');

  const cars = (data ?? []).filter((c) => !filter || c.status === filter);

  return (
    <>
      <PageHeader
        title="Live tracking"
        actions={
          <>
            <Span color="var(--text-muted)">Auto-refresh every {TIMING.trackingPollMs / MS_PER_SECOND}s</Span>
            <Select value={filter} onChange={setFilter} options={TRACKING_FILTERS} placeholder={`All (${data?.length ?? 0})`} />
          </>
        }
      />
      {error && <ErrorState error={getErrorMessage(error)} onRetry={refetch} />}
      <Card>
        <Stack direction="row" gap="md" align="center" wrap>
          {TRACKING_FILTERS.map((s) => (
            <Stack key={s} direction="row" gap="xs" align="center">
              <Swatch color={CAR_STATE_COLORS[s]} />
              <Span>{s}</Span>
            </Stack>
          ))}
        </Stack>
        <MapView>
          {cars.map((c) => (
            <CircleMarker
              key={c.id}
              center={[c.latitude, c.longitude]}
              radius={MAP.markerRadius.md}
              color={CAR_STATE_COLORS[c.status]}
              fillOpacity={MARKER_FILL_OPACITY}
            >
              <Popup>
                <Stack gap="2xs">
                  <Link component={RouterLink} to={ROUTES.CAR(c.id)}>
                    <Span weight={600} color="inherit">
                      {c.brandName} {c.modelName}
                    </Span>
                  </Link>
                  <Span>
                    {c.plateNumber} · {c.status} · {c.speed} km/h · fuel {c.fuelLevel}% · {c.online ? 'online' : 'offline'}
                  </Span>
                  {c.activeRentalId && (
                    <Link component={RouterLink} to={ROUTES.RENTAL(c.activeRentalId)}>
                      Rental #{c.activeRentalId}
                    </Link>
                  )}
                </Stack>
              </Popup>
            </CircleMarker>
          ))}
        </MapView>
      </Card>
    </>
  );
};

export default Tracking;
