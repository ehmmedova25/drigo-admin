import type { ReactNode } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MAP } from '@/constants/config';
import styles from './style.module.scss';

export interface MapViewProps {
  center?: [number, number];
  zoom?: number;
  children?: ReactNode;
}

export const MapView = ({ center = MAP.center, zoom = MAP.zoom, children }: MapViewProps) => {
  return (
    <MapContainer center={center} zoom={zoom} className={styles.root} scrollWheelZoom>
      <TileLayer attribution={MAP.attribution} url={MAP.tileUrl} />
      {children}
    </MapContainer>
  );
};
