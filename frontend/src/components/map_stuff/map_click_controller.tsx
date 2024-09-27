import { useMapEvent } from 'react-leaflet';

// export interface MapClickControllerProps {}

export function MapClickController() {
  useMapEvent('click', (e) => {
    console.log(`@@ @@ clicked on ${e.latlng.lat} / ${e.latlng.lng}`);
  });
  return <></>;
}
