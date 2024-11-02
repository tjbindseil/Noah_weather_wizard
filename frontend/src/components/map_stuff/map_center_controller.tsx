import { LatLng } from 'leaflet';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useMapService } from '../../services/map_service';

export interface MapCenterControllerProps {
  desiredCenter: LatLng;
}

export const MapCenterController = ({ desiredCenter }: MapCenterControllerProps) => {
  const mapService = useMapService();
  const map = useMap();

  // on render
  useEffect(() => {
    const currCenter = map.getCenter();
    if (!currCenter.equals(desiredCenter)) {
      map.setView(desiredCenter);
      mapService.saveCenter(desiredCenter.lat, desiredCenter.lng);
    }
  }, [desiredCenter]);

  return <></>;
};
