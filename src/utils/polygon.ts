import type { LatLng } from '@/types/geo.types';

const KM_PER_DEGREE_LAT = 111.32;
const kmPerDegreeLng = (lat: number) => KM_PER_DEGREE_LAT * Math.cos((lat * Math.PI) / 180);

export const squarePolygon = (center: LatLng, sizeKm: number): LatLng[] => {
  const dLat = sizeKm / 2 / KM_PER_DEGREE_LAT;
  const dLng = sizeKm / 2 / kmPerDegreeLng(center.lat);
  return [
    { lat: center.lat - dLat, lng: center.lng - dLng },
    { lat: center.lat - dLat, lng: center.lng + dLng },
    { lat: center.lat + dLat, lng: center.lng + dLng },
    { lat: center.lat + dLat, lng: center.lng - dLng },
  ];
};

export const polygonBox = (polygon: LatLng[]): { center: LatLng; sizeKm: number } | null => {
  if (polygon.length === 0) return null;
  const lats = polygon.map((p) => p.lat);
  const lngs = polygon.map((p) => p.lng);
  const center = { lat: (Math.min(...lats) + Math.max(...lats)) / 2, lng: (Math.min(...lngs) + Math.max(...lngs)) / 2 };
  return { center, sizeKm: (Math.max(...lats) - Math.min(...lats)) * KM_PER_DEGREE_LAT };
};
