import { LatLngBoundsExpression, LatLngExpression, LatLngTuple } from 'leaflet';
import { useMap } from 'react-leaflet';

export interface MapZoomControllerProps {
  selectedSpots: LatLngTuple[];
}

export function MapZoomController({ selectedSpots }: MapZoomControllerProps) {
  // TODO map.fitBounds if points are empty
  const map = useMap();

  if (selectedSpots.length > 0) {
    console.log(`@@ @@ selectedSpots are: ${JSON.stringify(selectedSpots)}`);
    map.fitBounds(selectedSpots);
    map.setMaxZoom(16);
  } else {
    map.fitWorld();
  }
  return <></>;
}
