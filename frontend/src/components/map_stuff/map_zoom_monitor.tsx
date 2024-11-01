import { useMap } from 'react-leaflet';

export interface MapZoomMonitorProps {
  setMapZoom: (zoom: number) => void;
}

export const MapZoomMonitor = ({ setMapZoom }: MapZoomMonitorProps) => {
  const map = useMap();

  // and when the map moves
  map.on('moveend', () => {
    console.log(`on moveend - saving zoom, center is: ${map.getZoom()}`);
    setMapZoom(map.getZoom());
  });

  return <></>;
};
