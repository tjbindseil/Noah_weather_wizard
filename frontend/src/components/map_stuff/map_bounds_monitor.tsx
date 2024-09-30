import { LatLngBounds } from 'leaflet';
import { useMap } from 'react-leaflet';

export interface MapBoundsMonitorProps {
  setMapBounds: (bounds: LatLngBounds) => void;
}

export const MapBoundsMonitor = ({ setMapBounds }: MapBoundsMonitorProps) => {
  const map = useMap();
  map.on('moveend', function () {
    console.log('moveend callback');
    // setMapBounds(map.getBounds());
  });

  return <></>;
};
