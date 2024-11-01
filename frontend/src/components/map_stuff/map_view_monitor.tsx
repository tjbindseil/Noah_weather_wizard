import { useMap } from 'react-leaflet';
import { useMapService } from '../../services/map_service';

export const MapViewMonitor = () => {
  const map = useMap();
  const mapService = useMapService();

  // all this does is save the zoom and center so that we can keep the map the same while moving from page to page
  map.on('moveend', () => {
    mapService.saveZoom(map.getZoom());

    const center = map.getCenter();
    mapService.saveCenter(center.lat, center.lng);
  });

  return <></>;
};
