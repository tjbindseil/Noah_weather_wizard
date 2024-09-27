import { LatLngTuple } from 'leaflet';
import { useMap } from 'react-leaflet';

export interface MapZoomControllerProps {
  selectedSpots: LatLngTuple[];
}

export function MapZoomController({ selectedSpots }: MapZoomControllerProps) {
  const map = useMap();

  if (selectedSpots.length > 0) {
    map.fitBounds(selectedSpots);
    map.setMaxZoom(16);
  } else {
    map.fitWorld();
  }
  return <></>;
}
