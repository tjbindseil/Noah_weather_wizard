import { useMap } from 'react-leaflet';

export interface MapCenterMonitorProps {
  setCenterLat: (zoom: number) => void;
  setCenterLng: (zoom: number) => void;
}

export const MapCenterMonitor = ({ setCenterLat, setCenterLng }: MapCenterMonitorProps) => {
  const map = useMap();

  // and when the map moves
  map.on('moveend', () => {
    const center = map.getCenter();
    console.log(`on moveend - saving center, center is: ${center.toString()}`);
    setCenterLat(center.lat);
    setCenterLng(center.lng);
  });

  return <></>;
};
