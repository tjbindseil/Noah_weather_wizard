import { LatLngBoundsExpression, LatLngExpression } from 'leaflet';
import { useMap } from 'react-leaflet';

export interface MapZoomControllerProps {
  selectedSpots: LatLngExpression[];
}

export function MapZoomController({ selectedSpots }: MapZoomControllerProps) {
  // TODO map.fitBounds if points are empty
  const map = useMap();

  selectedSpots.length > 0
    ? map.fitBounds(selectedSpots as unknown as LatLngBoundsExpression)
    : map.fitWorld();
  return <></>;
}
