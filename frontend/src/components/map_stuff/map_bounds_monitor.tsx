import { LatLngBounds } from 'leaflet';
import { useMap } from 'react-leaflet';

export interface MapBoundsMonitorProps {
  setMapBounds: (bounds: LatLngBounds) => void;
}

export const MapBoundsMonitor = ({ setMapBounds }: MapBoundsMonitorProps) => {
  const map = useMap();
  let lastBounds = map.getBounds();
  map.on('moveend', function () {
    console.log('moveend callback');
    // TJTAG the below causes this to get called over and over, need to determine why
    const newBounds = map.getBounds();
    if (!lastBounds.equals(newBounds)) {
      lastBounds = newBounds;
      console.log(
        `updating bounds, oldBounds=${lastBounds.toBBoxString()} and newBounds=${newBounds.toBBoxString()}`,
      );
      setMapBounds(newBounds);
    }
  });

  return <></>;
};
