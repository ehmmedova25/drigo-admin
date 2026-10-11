import { Circle, CircleMarker, Polygon, Tooltip } from 'react-leaflet';
import { MapView } from '@/components/common/map-view';
import { MAP } from '@/constants/config';
import type { GasStation, GeoZone, ParkingZone } from '@/types/geo.types';

export interface GeoMapProps {
  zones: GeoZone[];
  parkingZones: ParkingZone[];
  gasStations: GasStation[];
}

const STATION_RADIUS_PX = 5;
const INACTIVE_OPACITY = 0.05;
const ACTIVE_OPACITY = 0.2;

export const GeoMap = ({ zones, parkingZones, gasStations }: GeoMapProps) => {
  return (
    <MapView>
      {zones.map((z) => (
        <Polygon
          key={z.id}
          positions={z.polygon.map((p) => [p.lat, p.lng])}
          pathOptions={{ color: z.color, fillOpacity: z.isActive ? ACTIVE_OPACITY : INACTIVE_OPACITY, dashArray: z.isActive ? undefined : '4' }}
        >
          <Tooltip>
            {z.name} · {z.type}
            {!z.isActive && ' (inactive)'}
          </Tooltip>
        </Polygon>
      ))}
      {parkingZones.map((p) => (
        <Circle key={`p${p.id}`} center={[p.latitude, p.longitude]} radius={p.radiusMeters} pathOptions={{ color: MAP.colors.success }}>
          <Tooltip>
            {p.name} · {p.isFree ? 'free' : 'paid'} parking
          </Tooltip>
        </Circle>
      ))}
      {gasStations.map((g) => (
        <CircleMarker key={`g${g.id}`} center={[g.latitude, g.longitude]} radius={STATION_RADIUS_PX} pathOptions={{ color: MAP.colors.danger }}>
          <Tooltip>{g.name}</Tooltip>
        </CircleMarker>
      ))}
    </MapView>
  );
};
