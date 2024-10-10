import { LatLngBounds } from 'leaflet';
import { useMap } from 'react-leaflet';

export interface MapBoundsMonitorProps {
  setMapBounds: (bounds: LatLngBounds) => void;
}

export const MapBoundsMonitor = ({ setMapBounds }: MapBoundsMonitorProps) => {
  const map = useMap();

  // set right off the bat
  setMapBounds(map.getBounds());

  // and when the map moves
  map.on('moveend', () => {
    setMapBounds(map.getBounds());
  });

  return <></>;
};
